package com.medic115.mwms_be;

import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.TokenType;
import com.medic115.mwms_be.models.*;
import com.medic115.mwms_be.repositories.*;
import com.medic115.mwms_be.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
public class MwmsBeApplication implements CommandLineRunner {

    private final AccountRepo accountRepo;

    private final AreaRepo areaRepo;

    private final BatchRepo batchRepo;

    private final BatchItemRepo batchItemRepo;

    private final CategoryRepo categoryRepo;

    private final EquipmentRepo equipmentRepo;

    private final ItemGroupRepo itemGroupRepo;

    private final PartnerRepo partnerRepo;

    private final PartnerEquipmentRepo partnerEquipmentRepo;

    private final PositionRepo positionRepo;

    private final RequestApplicationRepo requestApplicationRepo;

    private final RequestItemRepo requestItemRepo;

    private final TaskRepo taskRepo;

    private final TokenRepo tokenRepo;

    private final UserRepo userRepo;

    private final JWTService jwtService;

    public static void main(String[] args) {
        SpringApplication.run(MwmsBeApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {}

    @Bean
    public CommandLineRunner initData() {
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
                List<Account> accounts = new ArrayList<>();
                List<Area> areas = new ArrayList<>();
                List<Batch> batches = new ArrayList<>();
                List<BatchItem> batchItems = new ArrayList<>();
                List<Category> categories = new ArrayList<>();
                List<Equipment> equipments = new ArrayList<>();
                List<ItemGroup> itemGroups = new ArrayList<>();
                List<Partner> partners = new ArrayList<>();
                List<PartnerEquipment> partnerEquipments = new ArrayList<>();
                List<Position> positions = new ArrayList<>();
                List<RequestApplication> requestApplications = new ArrayList<>();
                List<RequestItem> requestItems = new ArrayList<>();
                List<Task> tasks = new ArrayList<>();
                List<Token> tokens = new ArrayList<>();
                List<User> users = new ArrayList<>();
                List<String> accountName = List.of("admin", "manager", "staff1", "staff2", "supplier1", "supplier2", "requester1", "requester2");
                List<String> roles = List.of("admin", "manager", "staff", "staff", "partner", "partner", "partner", "partner");

                //-----------------------------Account-----------------------------//
                accountName.forEach(acc -> {
                    Account a = Account.builder()
                            .username(acc)
                            .password("1")
                            .role(Role.valueOf(roles.get(accountName.indexOf(acc)).toUpperCase()))
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();
                    accounts.add(a);
                    accountRepo.save(a);
                });

                //-----------------------------User-----------------------------//
                accounts.forEach(acc -> {
                    User u = User.builder()
                            .account(acc)
                            .name(acc.getUsername())
                            .email(acc.getUsername() + "@bulldozer.com")
                            .phone("0909")
                            .build();

                    users.add(u);
                    userRepo.save(u);
                });

                //-----------------------------Partner-----------------------------//
                accounts.forEach(acc -> {
                    if(acc.getRole().name().equals(Role.PARTNER.name())){
                        Partner p = Partner.builder()
                                .user(users.get(accounts.indexOf(acc)))
                                .type(acc.getUsername().contains("requester") ? "requester" : "supplier")
                                .build();

                        partners.add(p);
                        partnerRepo.save(p);
                    }
                });

                //-----------------------------Token-----------------------------//
                accounts.forEach(acc -> {
                    String accessValue = jwtService.generateAccessToken(accountRepo.findByUsername(acc.getUsername()).get());
                    String refreshValue = jwtService.generateRefreshToken(accountRepo.findByUsername(acc.getUsername()).get());

                    Token access =  Token.builder()
                            .account(acc)
                            .value(accessValue)
                            .type(TokenType.ACCESS.getValue())
                            .createdDate(jwtService.extractIssuedAt(accessValue))
                            .expiredDate(jwtService.extractExpiration(accessValue))
                            .status(Status.TOKEN_ACTIVE.getValue())
                            .build();

                    Token refresh =  Token.builder()
                            .account(acc)
                            .value(refreshValue)
                            .type(TokenType.REFRESH.getValue())
                            .createdDate(jwtService.extractIssuedAt(refreshValue))
                            .expiredDate(jwtService.extractExpiration(refreshValue))
                            .status(Status.TOKEN_ACTIVE.getValue())
                            .build();

                    tokens.add(access);
                    tokens.add(refresh);

                    tokenRepo.save(access);
                    tokenRepo.save(refresh);
                });
            }
        };
    }
}
