package com.medic115.mwms_be;

import com.medic115.mwms_be.enums.CodeFormat;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.Type;
import com.medic115.mwms_be.models.*;
import com.medic115.mwms_be.repositories.*;
import com.medic115.mwms_be.services.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@SpringBootApplication
@RequiredArgsConstructor
@EnableScheduling
public class MwmsBeApplication{

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

    @Bean
    public CommandLineRunner initData() {
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
                List<Account> accounts = new ArrayList<>();
                List<Partner> partners = new ArrayList<>();
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
                            .logged(false)
                            .build();
                    accounts.add(a);
                    accountRepo.save(a);
                });

                //-----------------------------User-----------------------------//
                accounts.forEach(acc -> {
                    User u = User.builder()
                            .account(acc)
                            .name(acc.getUsername())
                            .email(acc.getUsername() + "@medic.com")
                            .phone("0908765432")
                            .build();

                    users.add(u);
                    userRepo.save(u);
                });

                //-----------------------------Partner-----------------------------//
                accounts.forEach(acc -> {
                    if (acc.getRole().name().equals(Role.PARTNER.name())) {
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

                    Token access = Token.builder()
                            .account(acc)
                            .value(accessValue)
                            .type(Type.TOKEN_ACCESS.getValue())
                            .status(Status.TOKEN_ACTIVE.getValue())
                            .build();

                    Token refresh = Token.builder()
                            .account(acc)
                            .value(refreshValue)
                            .type(Type.TOKEN_REFRESH.getValue())
                            .status(Status.TOKEN_ACTIVE.getValue())
                            .build();

                    tokens.add(access);
                    tokens.add(refresh);

                    tokenRepo.save(access);
                    tokenRepo.save(refresh);
                });

                // ----------------------------- Category & Equipment ----------------------------- //
                List<String> categoryNames = List.of("Medical Devices", "Laboratory Equipment", "Personal Protective Equipment");
                List<Category> categories = new ArrayList<>();

                for (String categoryName : categoryNames) {
                    Category category = Category.builder()
                            .code("CAT-" + categoryName.replace(" ", "-").toUpperCase())
                            .name(categoryName)
                            .description("Various types of " + categoryName)
                            .build();
                    categories.add(category);
                    categoryRepo.save(category);
                }

                List<Equipment> equipments = new ArrayList<>();
                for (Category category : categories) {
                    for (int i = 1; i <= 2; i++) {
                        Equipment equipment = Equipment.builder()
                                .code("EQ-" + i + "-" + category.getCode())
                                .name(category.getName() + " Model " + i)
                                .description("High-quality " + category.getName() + " Model " + i)
                                .price(5000.0 * i)
                                .unit("pcs")
                                .category(category)
                                .status(Status.EQUIPMENT_ACTIVE.getValue())
                                .build();
                        equipments.add(equipment);
                        equipmentRepo.save(equipment);
                    }
                }

                // ----------------------------- Area ----------------------------- //
                List<String> areaNames = List.of("Storage A", "Storage B", "Receiving Dock", "Quality Check", "Dispatch Zone");
                List<Area> areas = new ArrayList<>();

                for (String name : areaNames) {
                    Area area = Area.builder()
                            .name(name)
                            .status(Status.AREA_AVAILABLE.getValue())
                            .square(200)
                            .equipment(equipments.get(areaNames.indexOf(name)))
                            .build();
                    areas.add(area);
                    areaRepo.save(area);
                }

                // ----------------------------- Position ----------------------------- //
                List<Position> positions = new ArrayList<>();
                int index = 1;
                for (Area area : areas) {
                    for (int i = 1; i <= 3; i++) {
                        Position position = Position.builder()
                                .name("Shelf " + index + " in " + area.getName())
                                .area(area)
                                .build();
                        positions.add(position);
                        positionRepo.save(position);
                        index++;
                    }
                }

                // ----------------------------- Partner Equipment ----------------------------- //
                List<PartnerEquipment> partnerEquipments = new ArrayList<>();
                List<Partner> partnerList = partnerRepo.findAll();

                for (Partner partner : partnerList) {
                    for (Equipment equipment : equipments) {
                        PartnerEquipment pe = PartnerEquipment.builder()
                                .partner(partner)
                                .equipment(equipment)
                                .build();
                        partnerEquipments.add(pe);
                    }
                }
                partnerEquipmentRepo.saveAll(partnerEquipments);
            };
        };
    }
}