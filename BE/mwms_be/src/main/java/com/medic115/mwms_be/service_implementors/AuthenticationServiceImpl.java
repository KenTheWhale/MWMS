package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.RefreshTokenRequest;
import com.medic115.mwms_be.dto.requests.SignInRequest;
import com.medic115.mwms_be.dto.response.JwtAuthenticationResponse;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.TokenType;
import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Token;
import com.medic115.mwms_be.repositories.AccountRepo;
import com.medic115.mwms_be.repositories.TokenRepo;
import com.medic115.mwms_be.services.AuthenticationService;
import com.medic115.mwms_be.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final PasswordEncoder passwordEncoder;

    private final JWTService jwtService;

    private final AccountRepo accountRepo;

    private final TokenRepo tokenRepo;

    @Value("${jwt.expiration.access-token}")
    private long accessExpiration;

    @Value("${jwt.expiration.refresh-token}")
    private long refreshExpiration;

    @Override
    public ResponseEntity<JwtAuthenticationResponse> signIn(SignInRequest request) {
        Account acc = accountRepo.findByUsernameAndPassword(request.getUsername(), request.getPassword()).orElse(null);
        if (acc == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            JwtAuthenticationResponse.builder()
                                    .message("Username or password is incorrect")
                                    .token("")
                                    .build()
                    );
        }

        //Search if any refresh or access token is active
        Token refresh = jwtService.checkTokenIsValid(acc, TokenType.REFRESH.getValue());
        Token access = jwtService.checkTokenIsValid(acc, TokenType.ACCESS.getValue());

        //if refresh is null (no active refresh found) then create a new one
        if (refresh == null) {
            String newRefresh = jwtService.generateRefreshToken(acc);
            tokenRepo.save(Token.builder()
                    .account(acc)
                    .status(Status.TOKEN_ACTIVE.getValue())
                    .type(TokenType.REFRESH.getValue())
                    .value(newRefresh)
                    .createdDate(jwtService.extractIssuedAt(newRefresh))
                    .expiredDate(jwtService.extractExpiration(newRefresh))
                    .build()
            );
        }

        //if access is null (no active access found) then create a new one
        if (access == null) {
            String newAccess = jwtService.generateAccessToken(acc);
            access = tokenRepo.save(Token.builder()
                    .account(acc)
                    .status(Status.TOKEN_ACTIVE.getValue())
                    .type(TokenType.ACCESS.getValue())
                    .value(newAccess)
                    .createdDate(jwtService.extractIssuedAt(newAccess))
                    .expiredDate(jwtService.extractExpiration(newAccess))
                    .build()
            );
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        JwtAuthenticationResponse.builder()
                                .message("Sign in successfully")
                                .token(access.getValue())
                                .build()
                );
    }

    @Override
    public ResponseEntity<JwtAuthenticationResponse> refreshToken(RefreshTokenRequest request) {
        String username = jwtService.extractUsername(request.getToken());
        if (username != null) {
            Account acc = accountRepo.findByUsername(username).orElse(null);
            if (acc != null) {
                Token access = jwtService.checkTokenIsValid(acc, TokenType.ACCESS.getValue());
                Token refresh = jwtService.checkTokenIsValid(acc, TokenType.REFRESH.getValue());
                if(access.getValue().equals(request.getToken())){
                    if(refresh != null){
                        refresh.setStatus(Status.TOKEN_EXPIRED.getValue());
                        tokenRepo.save(refresh);
                    }
                    String newRefresh = jwtService.generateRefreshToken(acc);
                    tokenRepo.save(
                            Token.builder()
                                    .account(acc)
                                    .status(Status.TOKEN_ACTIVE.getValue())
                                    .type(TokenType.REFRESH.getValue())
                                    .value(newRefresh)
                                    .createdDate(jwtService.extractIssuedAt(newRefresh))
                                    .expiredDate(jwtService.extractExpiration(newRefresh))
                                    .build()
                    );

                    return ResponseEntity.status(HttpStatus.OK).body(JwtAuthenticationResponse.builder().token(request.getToken()).message("Refresh successfully").build());
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(JwtAuthenticationResponse.builder().token("").message("Account not found").build());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(JwtAuthenticationResponse.builder().token("").message("Token invalid").build());
    }
}
