package com.medic115.mwms_be.services;

import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Token;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Date;

public interface JWTService {
    String extractUsername(String token);
    LocalDate extractExpiration(String token);
    LocalDate extractIssuedAt(String token);
    String generateAccessToken(UserDetails user);
    String generateRefreshToken(UserDetails user);
    Token checkTokenIsValid(Account acc, String tokenType);
}
