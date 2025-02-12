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
import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
public class MwmsBeApplication implements CommandLineRunner {

    private final AccountRepo accountRepo;

    private final TokenRepo tokenRepo;

    private final JWTService jwtService;

    private final RequestApplicationRepo requestApplicationRepo;

    private final RequestItemRepo requestItemRepo;

    private final BatchRepo batchRepo;

    private final EquipmentRepo equipmentRepo;
    private final CategoryRepo categoryRepo;


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
                List<RequestApplication> requestApplications = new ArrayList<>();
                List<RequestItem> requestItems = new ArrayList<>();
                List<Batch> batches = new ArrayList<>();
                List<Equipment> equipments = new ArrayList<>();
                List<Category> categories = new ArrayList<>();

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


                RequestApplication requestApplication1 = RequestApplication
                        .builder()
                        .code("REQ1")
                        .task(null)
                        .type("import")
                        .requestDate(LocalDate.now())
                        .lastModifiedDate(LocalDate.now())
                        .status(Status.REQUEST_PENDING.getValue())
                        .deliveryDate(LocalDate.now())
                        .build();
                RequestApplication requestApplication2 = RequestApplication
                        .builder()
                        .code("REQ2")
                        .task(null)
                        .type("import")
                        .requestDate(LocalDate.now())
                        .lastModifiedDate(LocalDate.now())
                        .status(Status.REQUEST_PENDING.getValue())
                        .deliveryDate(LocalDate.now())
                        .build();
                RequestApplication requestApplication3 = RequestApplication
                        .builder()
                        .code("REQ3")
                        .task(null)
                        .type("import")
                        .requestDate(LocalDate.now())
                        .lastModifiedDate(LocalDate.now())
                        .status(Status.REQUEST_PENDING.getValue())
                        .deliveryDate(LocalDate.now())
                        .build();
                RequestApplication requestApplication4 = RequestApplication
                        .builder()
                        .code("REQ4")
                        .task(null)
                        .type("import")
                        .requestDate(LocalDate.now())
                        .lastModifiedDate(LocalDate.now())
                        .status(Status.REQUEST_PENDING.getValue())
                        .deliveryDate(LocalDate.now())
                        .build();
                RequestApplication requestApplication5 = RequestApplication
                        .builder()
                        .code("REQ5")
                        .task(null)
                        .type("import")
                        .requestDate(LocalDate.now())
                        .lastModifiedDate(LocalDate.now())
                        .status(Status.REQUEST_PENDING.getValue())
                        .deliveryDate(LocalDate.now())
                        .build();

                requestApplications.add(requestApplication1);
                requestApplications.add(requestApplication2);
                requestApplications.add(requestApplication3);
                requestApplications.add(requestApplication4);
                requestApplications.add(requestApplication5);
                requestApplicationRepo.saveAll(requestApplications);

                Category category1 = Category
                        .builder()
                        .code("CATEGORY1")
                        .description("Description1")
                        .name("Category name 1")
                        .build();
                Category category2 = Category
                        .builder()
                        .code("CATEGORY1")
                        .description("Description1")
                        .name("Category name 1")
                        .build();
                Category category3 = Category
                        .builder()
                        .code("CATEGORY1")
                        .description("Description1")
                        .name("Category name 1")
                        .build();
                Category category4 = Category
                        .builder()
                        .code("CATEGORY1")
                        .description("Description1")
                        .name("Category name 1")
                        .build();
                Category category5 = Category
                        .builder()
                        .code("CATEGORY1")
                        .description("Description1")
                        .name("Category name 1")
                        .build();

                categories.add(category1);
                categories.add(category2);
                categories.add(category3);
                categories.add(category4);
                categories.add(category5);
                categoryRepo.saveAll(categories);

                Equipment equipment1 = Equipment
                        .builder()
                        .name("EQUIPMENT1")
                        .category(category1)
                        .description("This is Eq1")
                        .price(300)
                        .unit("batch")
                        .build();
                Equipment equipment2 = Equipment
                        .builder()
                        .name("EQUIPMENT2")
                        .category(category2)
                        .description("This is Eq2")
                        .price(300)
                        .unit("batch")
                        .build();
                Equipment equipment3 = Equipment
                        .builder()
                        .name("EQUIPMENT3")
                        .category(category3)
                        .description("This is Eq3")
                        .price(300)
                        .unit("batch")
                        .build();
                Equipment equipment4 = Equipment
                        .builder()
                        .name("EQUIPMENT4")
                        .category(category4)
                        .description("This is Eq4")
                        .price(300)
                        .unit("batch")
                        .build();
                Equipment equipment5 = Equipment
                        .builder()
                        .name("EQUIPMENT5")
                        .category(category5)
                        .description("This is Eq5")
                        .price(300)
                        .unit("batch")
                        .build();

                equipments.add(equipment1);
                equipments.add(equipment2);
                equipments.add(equipment3);
                equipments.add(equipment4);
                equipments.add(equipment5);
                equipmentRepo.saveAll(equipments);

                RequestItem requestItem1 = RequestItem
                        .builder()
                        .requestApplication(requestApplication1)
                        .equipment(equipment1)
                        .batch(null)
                        .quantity(10)
                        .unitPrice(300)
                        .carrierName("MWMS")
                        .carrierPhone("123456789")
                        .build();
                RequestItem requestItem2 = RequestItem
                        .builder()
                        .requestApplication(requestApplication1)
                        .equipment(equipment2)
                        .batch(null)
                        .quantity(10)
                        .unitPrice(300)
                        .carrierName("MWMS")
                        .carrierPhone("123456789")
                        .build();
                RequestItem requestItem3 = RequestItem
                        .builder()
                        .requestApplication(requestApplication1)
                        .equipment(equipment3)
                        .batch(null)
                        .quantity(10)
                        .unitPrice(300)
                        .carrierName("MWMS")
                        .carrierPhone("123456789")
                        .build();
                RequestItem requestItem4 = RequestItem
                        .builder()
                        .requestApplication(requestApplication1)
                        .equipment(equipment4)
                        .batch(null)
                        .quantity(10)
                        .unitPrice(300)
                        .carrierName("MWMS")
                        .carrierPhone("123456789")
                        .build();
                RequestItem requestItem5 = RequestItem
                        .builder()
                        .requestApplication(requestApplication1)
                        .equipment(equipment5)
                        .batch(null)
                        .quantity(10)
                        .unitPrice(300)
                        .carrierName("MWMS")
                        .carrierPhone("123456789")
                        .build();

                requestItems.add(requestItem1);
                requestItems.add(requestItem2);
                requestItems.add(requestItem3);
                requestItems.add(requestItem4);
                requestItems.add(requestItem5);
                requestItemRepo.saveAll(requestItems);



                Batch batch1 = Batch
                        .builder()
                        .code("BATCH1")
                        .requestItem(requestItem1)
                        .batchItems(null)
                        .position(null)
                        .build();
                Batch batch2 = Batch
                        .builder()
                        .code("BATCH2")
                        .requestItem(requestItem2)
                        .batchItems(null)
                        .equipmentQty(10)
                        .position(null)
                        .build();
                Batch batch3 = Batch
                        .builder()
                        .code("BATCH3")
                        .requestItem(requestItem3)
                        .batchItems(null)
                        .equipmentQty(10)
                        .position(null)
                        .build();
                Batch batch4 = Batch
                        .builder()
                        .code("BATCH4")
                        .requestItem(requestItem4)
                        .batchItems(null)
                        .equipmentQty(10)
                        .position(null)
                        .build();
                Batch batch5 = Batch
                        .builder()
                        .code("BATCH5")
                        .requestItem(requestItem5)
                        .batchItems(null)
                        .equipmentQty(10)
                        .position(null)
                        .build();

                batches.add(batch1);
                batches.add(batch2);
                batches.add(batch3);
                batches.add(batch4);
                batches.add(batch5);
                batchRepo.saveAll(batches);





            }
        };
    }
}
