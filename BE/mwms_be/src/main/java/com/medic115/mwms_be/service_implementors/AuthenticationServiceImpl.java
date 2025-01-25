package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.RefreshTokenRequest;
import com.medic115.mwms_be.dto.requests.SignInRequest;
import com.medic115.mwms_be.dto.requests.SignUpRequest;
import com.medic115.mwms_be.dto.response.JwtAuthenticationResponse;
import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Role;
import com.medic115.mwms_be.repositories.JwtRepository;
import com.medic115.mwms_be.repositories.UserRepository;
import com.medic115.mwms_be.services.AuthenticationService;
import com.medic115.mwms_be.services.JWTService;
import com.medic115.mwms_be.token.Token;
import com.medic115.mwms_be.token.TokenType;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JWTService jwtService;

    private final JwtRepository jwtRepository;

    private final UserRepository userRepository;

    @Override
    public void signUp(SignUpRequest signUpRequest) {
        Account account = new Account();
        account.setUsername(signUpRequest.getUsername());
        account.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        account.setFirstName(signUpRequest.getFirstName());
        account.setLastName(signUpRequest.getLastName());

        if (signUpRequest.getRoleName().equalsIgnoreCase(Role.ROLE_STAFF.name())) {
            account.setRole(Role.ROLE_STAFF);
        } else if (signUpRequest.getRoleName().equalsIgnoreCase(Role.ROLE_MANAGER.name())) {
            account.setRole(Role.ROLE_MANAGER);
        } else if (signUpRequest.getRoleName().equalsIgnoreCase(Role.ROLE_PARTNER.name())) {
            account.setRole(Role.ROLE_PARTNER);
        } else {
            account.setRole(Role.ROLE_ADMIN);
        }
        account.setStatus(true);
        userRepository.save(account);
    }

    @Override
    public JwtAuthenticationResponse signIn(SignInRequest signInRequest) {
       Authentication auth =  authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword()));
       Account user = (Account) auth.getPrincipal();
       if(!user.getStatus()){
           throw new IllegalArgumentException("User is not active !");
       }

       var jwt = jwtService.generateToken(user);
       var refreshToken = jwtService.generateRefreshToken(user);

       revokeAllUserToken(user);
       saveUserToken(user, jwt, refreshToken);

       return JwtAuthenticationResponse.builder()
               .token(jwt)
               .refreshToken(refreshToken)
               .build();
    }

    @Override
    public ResponseEntity<JwtAuthenticationResponse> refreshToken(RefreshTokenRequest refreshTokenRequest, HttpServletResponse response) {
        final String authHeader = refreshTokenRequest.getToken();
        final String refreshToken;
        final String username;

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        refreshToken = authHeader.substring(7);
        username = jwtService.extractUsername(refreshToken);
        final Token currentRefreshToken = jwtRepository.findByRefreshToken(refreshToken).orElse(null);

        if(username != null || currentRefreshToken != null) {
            var user = this.userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException(username + " is not found !"));
            if((jwtService.isTokenValid(refreshToken, user)) &&
            !currentRefreshToken.isRevoked() && !currentRefreshToken.isExpired()) {
                var accessToken = jwtService.generateToken(user);
                var newRefreshToken = jwtService.generateRefreshToken(user);

                revokeAllUserToken(user);
                saveUserToken(user, newRefreshToken, accessToken);

                JwtAuthenticationResponse authResponse = JwtAuthenticationResponse.builder()
                        .token(accessToken)
                        .refreshToken(newRefreshToken)
                        .build();
                return ResponseEntity.ok(authResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private void saveUserToken(Account user, String jwtToken, String jwtRefreshToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .refreshToken(jwtRefreshToken)
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .expired(false)
                .build();
        jwtRepository.save(token);
    }


    private String extractTokenFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private void revokeAllUserToken(Account user) {
        var validUserToken = jwtRepository.findAllValidTokensByUser((long) user.getId());
        if (validUserToken.isEmpty()) return;
        validUserToken.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        jwtRepository.saveAll(validUserToken);
    }
}
