package com.medic115.mwms_be.implementors;

import com.medic115.mwms_be.dto.requests.EditAccountRequest;
import com.medic115.mwms_be.dto.requests.SignInRequest;
import com.medic115.mwms_be.dto.requests.SignUpRequest;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.Type;
import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Partner;
import com.medic115.mwms_be.models.Token;
import com.medic115.mwms_be.models.User;
import com.medic115.mwms_be.repositories.AccountRepo;
import com.medic115.mwms_be.repositories.PartnerRepo;
import com.medic115.mwms_be.repositories.TokenRepo;
import com.medic115.mwms_be.repositories.UserRepo;
import com.medic115.mwms_be.services.AuthenticationService;
import com.medic115.mwms_be.services.JWTService;
import com.medic115.mwms_be.utils.CookieUtil;
import com.medic115.mwms_be.utils.TokenUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final JWTService jwtService;

    private final AccountRepo accountRepo;

    private final TokenRepo tokenRepo;

    private final PartnerRepo partnerRepo;

    private final UserRepo userRepo;

    @Value("${jwt.expiration.access-token}")
    private long accessExpiration;

    @Value("${jwt.expiration.refresh-token}")
    private long refreshExpiration;


    @Override
    public ResponseEntity<ResponseObject> login(SignInRequest request, HttpServletResponse response) {
        Account account = accountRepo.findByUsernameAndPassword(request.getUsername(), request.getPassword()).orElse(null);
        if (account == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Username or password incorrect")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        if(account.isLogged()){
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("This account has been logged in")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        account.setLogged(true);
        account = accountRepo.save(account);

        revokeAllTokens(account);

        Token newAccess = getActiveToken(account, Type.TOKEN_ACCESS.getValue());
        Token newRefresh = getActiveToken(account, Type.TOKEN_REFRESH.getValue());
        assert newAccess != null;
        assert newRefresh != null;

        CookieUtil.createCookies(response, newAccess.getValue(), newRefresh.getValue(), accessExpiration, refreshExpiration);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Login successfully")
                        .success(true)
                        .data(buildLoginBody(account))
                        .build()
        );
    }

    private void revokeAllTokens(Account account) {
        List<Token> tokens = tokenRepo.findAllByAccount_Id(account.getId());
        for (Token token : tokens) {
            TokenUtil.handleExpiredToken(token.getValue(), tokenRepo);
        }

        String accessToken = jwtService.generateAccessToken(account);
        String refreshToken = jwtService.generateRefreshToken(account);
        tokenRepo.save(
                Token.builder()
                        .value(accessToken)
                        .status(Status.TOKEN_ACTIVE.getValue())
                        .account(account)
                        .type(Type.TOKEN_ACCESS.getValue())
                        .build()
        );

        tokenRepo.save(
                Token.builder()
                        .value(refreshToken)
                        .status(Status.TOKEN_ACTIVE.getValue())
                        .account(account)
                        .type(Type.TOKEN_REFRESH.getValue())
                        .build()
        );
    }

    private Token getActiveToken(Account account, String type) {
        List<Token> tokens = tokenRepo.findAllByTypeAndStatusAndAccount_Id(type, Status.TOKEN_ACTIVE.getValue(), account.getId());
        if (!tokens.isEmpty()) {
            if (tokens.size() > 1) {
                for (int i = 0; i < tokens.size() - 1; i++) {
                    TokenUtil.handleExpiredToken(tokens.get(i).getValue(), tokenRepo);
                }
            }
            return tokens.get(tokens.size() - 1);
        }
        return null;
    }

    private Map<String, Object> buildLoginBody(Account account) {
        Map<String, Object> body = new HashMap<>();
        body.put("role", account.getRole().name().toLowerCase());
        if(account.getRole() == Role.PARTNER){
            body.put("type", account.getUser().getPartner().getType());
        }
        body.put("name", account.getUser().getName());
        body.put("email", account.getUser().getEmail());
        return body;
    }

    @Override
    public ResponseEntity<ResponseObject> logout(HttpServletRequest request, HttpServletResponse response) {

        Cookie refresh = CookieUtil.getCookie(request, "refresh");
        if (refresh == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("Logout failed")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        Token refreshToken = tokenRepo.findByValue(refresh.getValue()).orElse(null);
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("Token invalid")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        Account account = refreshToken.getAccount();
        account.setLogged(false);
        accountRepo.save(account);

        CookieUtil.removeCookies(response);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Logout successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> refresh(HttpServletRequest request, HttpServletResponse response) {
        Cookie refreshToken = CookieUtil.getCookie(request, "refresh");
        if(refreshToken != null && jwtService.checkIfNotExpired(refreshToken.getValue())){
            Token refresh = tokenRepo.findByValue(refreshToken.getValue()).orElse(null);
            if(refresh != null && revokeAllActiveAccessTokens(refresh.getAccount())) {
                String newAccess = jwtService.generateAccessToken(refresh.getAccount());
                tokenRepo.save(
                        Token.builder()
                                .value(newAccess)
                                .type(Type.TOKEN_ACCESS.getValue())
                                .account(refresh.getAccount())
                                .status(Status.TOKEN_ACTIVE.getValue())
                                .build()
                );

                CookieUtil.createCookies(response, newAccess, refreshToken.getValue(), accessExpiration, refreshExpiration);

                return ResponseEntity.status(HttpStatus.OK).body(
                        ResponseObject.builder()
                                .message("Refresh access token successfully")
                                .success(true)
                                .data(null)
                                .build()
                );
            }
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("No refresh token found")
                            .success(false)
                            .data(null)
                            .build());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                ResponseObject.builder()
                        .message("Refresh invalid")
                        .success(false)
                        .data(null)
                        .build()
        );
    }

    private boolean revokeAllActiveAccessTokens(Account account){
        List<Token> tokens = tokenRepo.findAllByTypeAndStatusAndAccount_Id(Type.TOKEN_ACCESS.getValue(), Status.TOKEN_ACTIVE.getValue(), account.getId());
        for(Token t: tokens){
            TokenUtil.handleExpiredToken(t.getValue(), tokenRepo);
        }
        return true;
    }

    // save all token relate to account
    private void saveAccountToken(Account account, String jwtToken, String refreshToken) {
        Token access = Token.builder()
                .account(account)
                .value(jwtToken)
                .type(Type.TOKEN_ACCESS.getValue())
                .status(Status.TOKEN_ACTIVE.getValue())
                .build();
        tokenRepo.save(access);

        Token refresh = Token.builder()
                .account(account)
                .value(refreshToken)
                .type(Type.TOKEN_REFRESH.getValue())
                .status(Status.TOKEN_ACTIVE.getValue())
                .build();
        tokenRepo.save(refresh);
    }

    @Override
    public ResponseEntity<String> signUp(SignUpRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Sign up request cannot be null");
        }

        boolean check = accountRepo.findByUsername(request.username()).isPresent();

        if(check){
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Username is already existed !"
                    );
        }

        if(!request.roleName().equals("staff") && !request.roleName().equals("supplier") && !request.roleName().equals("requester")) {
            throw new IllegalArgumentException("Invalid role");
        } else {
            Account acc = Account.builder()
                    .username(request.username())
                    .password(request.password())
                    .status(Status.ACCOUNT_ACTIVE.getValue())
                    .role(request.roleName().equals("staff") ? Role.STAFF : Role.PARTNER)
                    .build();
            accountRepo.save(acc);

            User user = User.builder()
                    .phone(request.phone())
                    .email(request.email())
                    .name(request.name())
                    .account(acc)
                    .build();
            userRepo.save(user);

            if(request.roleName().equals("supplier") || request.roleName().equals("requester")){
                Partner partner = Partner.builder()
                        .type(request.roleName())
                        .user(user)
                        .build();
                partnerRepo.save(partner);
            }
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                        "Sign up successful !"
                );
    }

    @Override
    public ResponseEntity<String> deleteUser(Integer id) {
        if(id == null){
            throw new IllegalArgumentException("User id cannot be null");
        }

        Account acc = accountRepo.findById(id).orElse(null);
        if(acc == null){
            throw new IllegalArgumentException("User not found");
        }

        acc.setStatus(Status.ACCOUNT_DELETE.getValue());

        accountRepo.save(acc);
        return ResponseEntity.status(HttpStatus.OK).body("User deleted successfully");
    }

    @Override
    public ResponseEntity<String> activateUser(Integer id) {
        if(id == null){
            throw new IllegalArgumentException("User id cannot be null");
        }

        Account acc = accountRepo.findById(id).orElse(null);
        if(acc == null){
            throw new IllegalArgumentException("User not found");
        }

        acc.setStatus(Status.ACCOUNT_ACTIVE.getValue());

        accountRepo.save(acc);
        return ResponseEntity.status(HttpStatus.OK).body("User activate successfully");
    }

    @Override
    public ResponseEntity<String> updateUser(Integer id, EditAccountRequest request) {
        if (id == null || request == null) {
            throw new IllegalArgumentException("User id and request edit cannot be null");
        }

        Account acc = accountRepo.findById(id).orElse(null);
        if (acc == null) {
            throw new IllegalArgumentException("User not found");
        }

        boolean checked = accountRepo.findByUsername(request.getUsername()).isPresent();

        if(checked){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Username is already existed !");
        }

        checked = userRepo.findByEmail(request.getEmail()).isPresent();

        if(checked){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email is already existed !");
        }


        acc.setUsername(request.getUsername());
        acc.setPassword(request.getPassword());
        acc.setRole(Role.valueOf(request.getRoleName().toUpperCase()));
        acc.getUser().setEmail(request.getEmail());
        acc.getUser().setName(request.getName());
        acc.getUser().setPhone(request.getPhone());

        accountRepo.save(acc);

        return ResponseEntity.status(HttpStatus.OK).body("User updated successfully");
    }
}