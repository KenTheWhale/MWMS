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

    private final PartnerRepo partnerRepo;

    private final RequestApplicationRepo requestApplicationRepo;

    private final RequestItemRepo requestItemRepo;

    private final BatchRepo batchRepo;

    private final BatchItemRepo batchItemRepo;

    private final EquipmentRepo equipmentRepo;

    private final CategoryRepo categoryRepo;

    private final AreaRepo areaRepo;

    private final PositionRepo positionRepo;

    private final TaskRepo taskRepo;

    public static void main(String[] args) {
        SpringApplication.run(MwmsBeApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
    }

    @Bean
    public CommandLineRunner initData() {
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
                List<Account> accounts = new ArrayList<>();
                List<RequestApplication> requestApplications = new ArrayList<>();
                List<RequestItem> requestItems = new ArrayList<>();
                List<Batch> batches = new ArrayList<>();
                List<Equipment> equipments = new ArrayList<>();
                List<Category> categories = new ArrayList<>();
                List<Area> areas = new ArrayList<>();
                List<Position> positions = new ArrayList<>();
                List<BatchItem> batchItems = new ArrayList<>();
                List<Task> tasks = new ArrayList<>();

                //init account
                if (accountRepo.findAll().isEmpty()) {
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

                    Account supplier = Account.builder()
                            .username("supplier")
                            .password("123")
                            .role(Role.PARTNER)
                            .phone("0909")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();

                    Account requester = Account.builder()
                            .username("requester")
                            .password("123")
                            .role(Role.PARTNER)
                            .phone("0909")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();
                    Account test1 = Account.builder()
                            .username("test1")
                            .password("123")
                            .role(Role.PARTNER)
                            .phone("0909")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();

                    Account test2 = Account.builder()
                            .username("test2")
                            .password("123")
                            .role(Role.PARTNER)
                            .phone("0909")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .build();



                    accounts.add(admin);
                    accounts.add(manager);
                    accounts.add(staff);
                    accounts.add(supplier);
                    accounts.add(requester);
                    accounts.add(test1);
                    accounts.add(test2);

                    accountRepo.saveAll(accounts);

                    Partner sp = partnerRepo.save(
                            Partner.builder()
                                    .name("supplier")
                                    .email("supplier@medic115.com")
                                    .address("123 Some Street")
                                    .type("supplier")
                                    .account(supplier)
                                    .build()
                    );

                    Partner rq = partnerRepo.save(
                            Partner.builder()
                                    .name("requester")
                                    .email("requester@medic115.com")
                                    .address("123 Some Street")
                                    .type("requester")
                                    .account(requester)
                                    .build()
                    );
                    Partner sp2 = partnerRepo.save(
                            Partner.builder()
                                    .name("tester1")
                                    .email("tester1@medic115.com")
                                    .address("123 Some Street")
                                    .type("supplier")
                                    .account(test1)
                                    .build()
                    );
                    Partner rq2 = partnerRepo.save(
                            Partner.builder()
                                    .name("tester2")
                                    .email("tester2@medic115.com")
                                    .address("123 Some Street")
                                    .type("requester")
                                    .account(test2)
                                    .build()
                    );

                    requester.setPartner(rq);
                    supplier.setPartner(sp);
                    test1.setPartner(sp2);
                    test2.setPartner(rq2);


                    accountRepo.save(requester);
                    accountRepo.save(supplier);
                    accountRepo.save(test1);
                    accountRepo.save(test2);

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

                    Task task1 = Task
                            .builder()
                            .code("TASK1")
                            .name("CHECK BATCH 1")
                            .staff(staff)
                            .description("This is a check batch task")
                            .status(Status.TASK_PROCESSING.getValue())
                            .assignedDate(LocalDate.now())
                            .build();
                    Task task2 = Task
                            .builder()
                            .code("TASK2")
                            .name("CHECK BATCH 2")
                            .staff(staff)
                            .description("This is a check batch task")
                            .status(Status.TASK_PROCESSING.getValue())
                            .assignedDate(LocalDate.now())
                            .build();
                    Task task3 = Task
                            .builder()
                            .code("TASK3")
                            .name("CHECK BATCH")
                            .staff(staff)
                            .description("This is a check batch task")
                            .status(Status.TASK_PROCESSING.getValue())
                            .assignedDate(LocalDate.now())
                            .build();
                    Task task4 = Task
                            .builder()
                            .code("TASK4")
                            .name("CHECK BATCH")
                            .staff(staff)
                            .description("This is a check batch task")
                            .status(Status.TASK_PROCESSING.getValue())
                            .assignedDate(LocalDate.now())
                            .build();
                    Task task5 = Task
                            .builder()
                            .code("TASK5")
                            .name("CHECK BATCH")
                            .staff(staff)
                            .description("This is a check batch task")
                            .status(Status.TASK_PROCESSING.getValue())
                            .assignedDate(LocalDate.now())
                            .build();

                    tasks.add(task1);
                    tasks.add(task2);
                    tasks.add(task3);
                    tasks.add(task4);
                    tasks.add(task5);
                    taskRepo.saveAll(tasks);


                    RequestApplication requestApplication1 = RequestApplication
                            .builder()
                            .code("REQ1")
                            .task(task1)
                            .type("import")
                            .requestDate(LocalDate.now())
                            .lastModifiedDate(LocalDate.now())
                            .status(Status.REQUEST_PENDING.getValue())
                            .deliveryDate(LocalDate.now())
                            .build();
                    RequestApplication requestApplication2 = RequestApplication
                            .builder()
                            .code("REQ2")
                            .task(task2)
                            .type("import")
                            .requestDate(LocalDate.now())
                            .lastModifiedDate(LocalDate.now())
                            .status(Status.REQUEST_PENDING.getValue())
                            .deliveryDate(LocalDate.now())
                            .build();
                    RequestApplication requestApplication3 = RequestApplication
                            .builder()
                            .code("REQ3")
                            .task(task3)
                            .type("import")
                            .requestDate(LocalDate.now())
                            .lastModifiedDate(LocalDate.now())
                            .status(Status.REQUEST_PENDING.getValue())
                            .deliveryDate(LocalDate.now())
                            .build();
                    RequestApplication requestApplication4 = RequestApplication
                            .builder()
                            .code("REQ4")
                            .task(task4)
                            .type("import")
                            .requestDate(LocalDate.now())
                            .lastModifiedDate(LocalDate.now())
                            .status(Status.REQUEST_PENDING.getValue())
                            .deliveryDate(LocalDate.now())
                            .build();
                    RequestApplication requestApplication5 = RequestApplication
                            .builder()
                            .code("REQ5")
                            .task(task5)
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
                            .partner(supplier.getPartner())
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
                            .partner(supplier.getPartner())
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
                            .partner(supplier.getPartner())
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
                            .partner(supplier.getPartner())
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
                            .partner(supplier.getPartner())
                            .carrierName("MWMS")
                            .carrierPhone("123456789")
                            .build();

                    requestItems.add(requestItem1);
                    requestItems.add(requestItem2);
                    requestItems.add(requestItem3);
                    requestItems.add(requestItem4);
                    requestItems.add(requestItem5);
                    requestItemRepo.saveAll(requestItems);


                    //------------------Area-----------------//
                    Area area1 = Area
                            .builder()
                            .name("AREA1")
                            .status(Status.AREA_AVAILABLE.getValue())
                            .maxQty(100)
                            .build();
                    Area area2 = Area
                            .builder()
                            .name("AREA1")
                            .status(Status.AREA_AVAILABLE.getValue())
                            .maxQty(100)
                            .build();
                    Area area3 = Area
                            .builder()
                            .name("AREA1")
                            .status(Status.AREA_AVAILABLE.getValue())
                            .maxQty(100)
                            .build();
                    Area area4 = Area
                            .builder()
                            .name("AREA1")
                            .status(Status.AREA_AVAILABLE.getValue())
                            .maxQty(100)
                            .build();
                    Area area5 = Area
                            .builder()
                            .name("AREA1")
                            .status(Status.AREA_AVAILABLE.getValue())
                            .maxQty(100)
                            .build();

                    areas.add(area1);
                    areas.add(area2);
                    areas.add(area3);
                    areas.add(area4);
                    areas.add(area5);
                    areaRepo.saveAll(areas);

                    Position position1 = Position
                            .builder()
                            .name("POSITION1")
                            .area(area1)
                            .build();
                    Position position2 = Position
                            .builder()
                            .name("POSITION2")
                            .area(area1)
                            .build();
                    Position position3 = Position
                            .builder()
                            .name("POSITION3")
                            .area(area1)
                            .build();

                    positions.add(position1);
                    positions.add(position2);
                    positions.add(position3);
                    positionRepo.saveAll(positions);

                    Batch batch1 = Batch
                            .builder()
                            .code("BATCH1")
                            .requestItem(requestItem1)
                            .createdDate(LocalDate.now())
                            .equipmentQty(10)
                            .position(position1)
                            .build();
                    Batch batch2 = Batch
                            .builder()
                            .code("BATCH2")
                            .requestItem(requestItem2)
                            .createdDate(LocalDate.now())
                            .equipmentQty(10)
                            .position(position1)
                            .build();
                    Batch batch3 = Batch
                            .builder()
                            .code("BATCH3")
                            .requestItem(requestItem3)
                            .createdDate(LocalDate.now())
                            .equipmentQty(10)
                            .position(position2)
                            .build();
                    Batch batch4 = Batch
                            .builder()
                            .code("BATCH4")
                            .requestItem(requestItem4)
                            .createdDate(LocalDate.now())
                            .equipmentQty(10)
                            .position(position3)
                            .build();
                    Batch batch5 = Batch
                            .builder()
                            .code("BATCH5")
                            .requestItem(requestItem5)
                            .createdDate(LocalDate.now())
                            .equipmentQty(10)
                            .position(position3)
                            .build();

                    batches.add(batch1);
                    batches.add(batch2);
                    batches.add(batch3);
                    batches.add(batch4);
                    batches.add(batch5);
                    batchRepo.saveAll(batches);

                    BatchItem batchItem1 = BatchItem
                            .builder()
                            .batch(batch1)
                            .importedDate(LocalDate.now())
                            .serialNumber("BAIT1")
                            .build();
                    BatchItem batchItem2 = BatchItem
                            .builder()
                            .batch(batch1)
                            .importedDate(LocalDate.now())
                            .serialNumber("BAIT2")
                            .build();

                    BatchItem batchItem3 = BatchItem
                            .builder()
                            .batch(batch2)
                            .importedDate(LocalDate.now())
                            .serialNumber("BAIT3")
                            .build();
                    BatchItem batchItem4 = BatchItem
                            .builder()
                            .batch(batch2)
                            .importedDate(LocalDate.now())
                            .serialNumber("BAIT4")
                            .build();
                    BatchItem batchItem5 = BatchItem
                            .builder()
                            .batch(batch3)
                            .importedDate(LocalDate.now())
                            .serialNumber("BAIT5")
                            .build();
                    BatchItem batchItem6 = BatchItem
                            .builder()
                            .batch(batch4)
                            .importedDate(LocalDate.now())
                            .serialNumber("BAIT6")
                            .build();
                    BatchItem batchItem7 = BatchItem
                            .builder()
                            .batch(batch5)
                            .importedDate(LocalDate.now())
                            .serialNumber("BAIT7")
                            .build();

                    batchItems.add(batchItem1);
                    batchItems.add(batchItem2);
                    batchItems.add(batchItem3);
                    batchItems.add(batchItem4);
                    batchItems.add(batchItem5);
                    batchItems.add(batchItem6);
                    batchItems.add(batchItem7);
                    batchItemRepo.saveAll(batchItems);


                }
            }
        };
    }
}
