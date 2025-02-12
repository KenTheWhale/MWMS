package com.medic115.mwms_be;

import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.TokenType;
import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.models.Token;
import com.medic115.mwms_be.repositories.AccountRepo;
import com.medic115.mwms_be.repositories.TokenRepo;
import com.medic115.mwms_be.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
public class MwmsBeApplication implements CommandLineRunner {

    private final AccountRepo accountRepo;

    private final TokenRepo tokenRepo;

    private final JWTService jwtService;

    public static void main(String[] args) {
        SpringApplication.run(MwmsBeApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {}

    @Bean
    public CommandLineRunner initData(){
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
                List<Account> accounts = new ArrayList<>();
                if(accountRepo.findAll().isEmpty()){
                    Account admin = Account.builder()
                            .username("admin")
                            .password("123")
                            .role(Role.ADMIN)
                            .phone("0909")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();

                    Account manager = Account.builder()
                            .username("manager")
                            .password("123")
                            .role(Role.MANAGER)
                            .phone("0909")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();

                    Account staff = Account.builder()
                            .username("staff")
                            .password("123")
                            .role(Role.STAFF)
                            .phone("0909")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();

                    Account partner = Account.builder()
                            .username("partner")
                            .password("123")
                            .role(Role.PARTNER)
                            .phone("0909")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();

                    accounts.add(admin);
                    accounts.add(manager);
                    accounts.add(staff);
                    accounts.add(partner);

                    accountRepo.saveAll(accounts);

                    for (Account account : accounts) {
                        String access = jwtService.generateAccessToken(account);
                        String refresh = jwtService.generateRefreshToken(account);
                        tokenRepo.save(
                                Token.builder()
                                        .value(access)
                                        .type(TokenType.ACCESS.getValue())
                                        .status(Status.TOKEN_ACTIVE.getValue())
                                        .account(account)
                                        .expiredDate(jwtService.extractExpiration(access))
                                        .createdDate(jwtService.extractIssuedAt(access))
                                        .build()
                        );

                        tokenRepo.save(
                                Token.builder()
                                        .value(refresh)
                                        .type(TokenType.REFRESH.getValue())
                                        .status(Status.TOKEN_ACTIVE.getValue())
                                        .account(account)
                                        .expiredDate(jwtService.extractExpiration(refresh))
                                        .createdDate(jwtService.extractIssuedAt(refresh))
                                        .build()
                        );
                    }
                }
            }
        };
    }
}
