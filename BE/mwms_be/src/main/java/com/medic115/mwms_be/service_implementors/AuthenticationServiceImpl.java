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

import java.time.LocalDate;

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


    // revoke all token relate to account
    private void revokeAllAccountToken(Account account){
        var validAccountToken = tokenRepo.findAllValidTokensByUser(account.getId());

        if(validAccountToken.isEmpty()) return;

        validAccountToken.forEach(token -> {
            token.setStatus(Status.TOKEN_EXPIRED.getValue());
            tokenRepo.save(token);
        });
    }

    @Override
    public ResponseEntity<JwtAuthenticationResponse> signIn(SignInRequest request) {
        Account acc = accountRepo.findByUsernameAndPassword(request.getUsername(), request.getPassword()).orElse(null);
        if (acc == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            JwtAuthenticationResponse.builder()
                                    .message("Username or password is incorrect")
                                    .token("")
                                    .build()
                    );
        }

        revokeAllAccountToken(acc);

        String accessToken = jwtService.generateAccessToken(acc);
        String refreshToken = jwtService.generateRefreshToken(acc);

        saveAccountToken(acc, accessToken, refreshToken);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        JwtAuthenticationResponse.builder()
                                .message("Sign in successfully")
                                .token(accessToken)
                                .build()
                );
    }

    // save all token relate to account
    private void saveAccountToken(Account account, String jwtToken, String refreshToken) {
        Token access = Token.builder()
                .account(account)
                .value(jwtToken)
                .createdDate(jwtService.extractIssuedAt(jwtToken))
                .expiredDate(jwtService.extractExpiration(jwtToken))
                .type(TokenType.ACCESS.getValue())
                .status(Status.TOKEN_ACTIVE.getValue())
                .build();
        tokenRepo.save(access);

        Token refresh = Token.builder()
                .account(account)
                .value(refreshToken)
                .createdDate(jwtService.extractIssuedAt(jwtToken))
                .expiredDate(jwtService.extractExpiration(jwtToken))
                .type(TokenType.REFRESH.getValue())
                .status(Status.TOKEN_ACTIVE.getValue())
                .build();
        tokenRepo.save(refresh);
    }

    @Override
    public ResponseEntity<JwtAuthenticationResponse> refreshToken(RefreshTokenRequest request) {

        String username = jwtService.extractUsername(request.getToken());
        if (username != null) {
            Account acc = accountRepo.findByUsername(username).orElse(null);
            if (acc != null) {
                Token access = tokenRepo.findByValue(request.getToken()).orElse(null);
                Token refresh = jwtService.checkTokenIsValid(acc, TokenType.REFRESH.getValue());
                if(access != null){
                    if(refresh == null){
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
                    }
                    access.setStatus(Status.TOKEN_EXPIRED.getValue());
                    tokenRepo.save(access);
                    String newAccess = jwtService.generateAccessToken(acc);
                    tokenRepo.save(
                            Token.builder()
                                    .account(acc)
                                    .status(Status.TOKEN_ACTIVE.getValue())
                                    .type(TokenType.ACCESS.getValue())
                                    .value(newAccess)
                                    .createdDate(jwtService.extractIssuedAt(newAccess))
                                    .expiredDate(jwtService.extractExpiration(newAccess))
                                    .build()
                    );

                    return ResponseEntity.status(HttpStatus.OK).body(JwtAuthenticationResponse.builder().token(request.getToken()).message("Refresh successfully").build());
                }
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(JwtAuthenticationResponse.builder().token("").message("Account not found").build());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(JwtAuthenticationResponse.builder().token("").message("Token invalid").build());
    }
}
