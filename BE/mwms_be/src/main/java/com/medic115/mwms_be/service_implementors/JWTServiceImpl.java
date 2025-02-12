package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Token;
import com.medic115.mwms_be.repositories.TokenRepo;
import com.medic115.mwms_be.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JWTServiceImpl implements JWTService {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.expiration.access-token}")
    private long accessExpiration;

    @Value("${jwt.expiration.refresh-token}")
    private long refreshExpiration;

    private final TokenRepo tokenRepo;

    @Override
    public String extractUsername(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        }catch (Exception e) {
            return null;
        }
    }

    @Override
    public LocalDate extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    @Override
    public LocalDate extractIssuedAt(String token) {
        return extractClaim(token, Claims::getIssuedAt).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers){
        return claimsResolvers.apply(extractAllClaims(token));
    }

    private Key getSignKey(){
        return Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secretKey));
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @Override
    public String generateAccessToken(Account account) {
        Map<String, Object> claims = generateClaims(account);
        return generateToken(claims, account, accessExpiration);
    }

    @Override
    public String generateRefreshToken(Account account) {
        Map<String, Object> claims = generateClaims(account);
        return generateToken(claims, account, refreshExpiration);
    }

    private Map<String, Object> generateClaims(Account account){
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", account.getRole().name());
        if(account.getRole().equals(Role.PARTNER)){
            claims.put("type", account.getPartner().getType());
        }else{
            claims.put("type", "");
        }
        return claims;
    }

    private String generateToken(Map<String, Object> extraClaims, UserDetails user, long expiredTime){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredTime))
                .signWith(getSignKey())
                .compact();
    }

    @Override
    public Token checkTokenIsValid(Account account, String tokenType) {
        Token t = tokenRepo.findByAccount_IdAndStatusAndType(account.getId(), Status.TOKEN_ACTIVE.getValue(), tokenType).orElse(null);
        if(t != null){
            if(extractClaim(t.getValue(), Claims::getExpiration).before(new Date())){
                t.setStatus(Status.TOKEN_EXPIRED.getValue());
                tokenRepo.save(t);
                return null;
            }
        }
        return t;
    }

    @Override
    public boolean checkToken(String token) {
        return extractClaim(token, Claims::getExpiration).after(new Date());
    }


}
