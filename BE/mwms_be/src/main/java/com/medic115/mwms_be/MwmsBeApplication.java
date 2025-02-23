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
    public void run(String... args) throws Exception {
    }

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
                            .type(TokenType.ACCESS.getValue())
                            .createdDate(jwtService.extractIssuedAt(accessValue))
                            .expiredDate(jwtService.extractExpiration(accessValue))
                            .status(Status.TOKEN_ACTIVE.getValue())
                            .build();

                    Token refresh = Token.builder()
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

                //-----------------------------Area-----------------------------//
                for (int i = 1; i <= 5; i++) {
                    Area area = Area.builder()
                            .name("Area " + i)
                            .status("ACTIVE")
                            .square(100 * i)
                            .build();
                    areas.add(area);
                    areaRepo.save(area);
                }

                //-----------------------------Position-----------------------------//
                areas.forEach(area -> {
                    for (int i = 1; i <= 3; i++) {
                        Position position = Position.builder()
                                .name("Position " + i + " in " + area.getName())
                                .area(area)
                                .build();
                        positions.add(position);
                        positionRepo.save(position);
                    }
                });

                //-----------------------------Category-----------------------------//
                for (int i = 1; i <= 5; i++) {
                    Category category = Category.builder()
                            .code("CAT-" + i)
                            .name("Category " + i)
                            .description("Description for category " + i)
                            .build();
                    categories.add(category);
                    categoryRepo.save(category);
                }

                //-----------------------------Equipment-----------------------------//
                categories.forEach(category -> {
                    for (int i = 1; i <= 2; i++) {
                        Equipment equipment = Equipment.builder()
                                .code("EQ-" + i + "-" + category.getCode())
                                .name("Equipment " + i)
                                .description("Description for equipment " + i)
                                .price(100.0 * i)
                                .unit("pcs")
                                .category(category)
                                .build();
                        equipments.add(equipment);
                        equipmentRepo.save(equipment);
                    }
                });

                //-----------------------------RequestApplication-----------------------------//
                for (int i = 1; i <= 3; i++) {
                    RequestApplication requestApplication = RequestApplication.builder()
                            .code("REQ-" + i)
                            .status("PENDING")
                            .type("ORDER")
                            .requestDate(LocalDate.now())
                            .lastModifiedDate(LocalDate.now())
                            .build();
                    requestApplications.add(requestApplication);
                    requestApplicationRepo.save(requestApplication);
                }

                //-----------------------------ItemGroup-----------------------------//
                requestApplications.forEach(request -> {
                    ItemGroup itemGroup = ItemGroup.builder()
                            .requestApplication(request)
                            .deliveryDate(LocalDate.now().plusDays(3))
                            .carrierName("Carrier " + request.getCode())
                            .carrierPhone("0909-" + request.getCode())
                            .build();
                    itemGroups.add(itemGroup);
                    itemGroupRepo.save(itemGroup);
                });

                //-----------------------------RequestItem-----------------------------//
                itemGroups.forEach(group -> equipments.forEach(equipment -> {
                    Partner partner = partners.stream()
                            .filter(p -> "supplier".equals(p.getType()))
                            .findFirst()
                            .orElse(null);

                    RequestItem requestItem = RequestItem.builder()
                            .quantity(5)
                            .unitPrice(100.0)
                            .equipment(equipment)
                            .itemGroup(group)
                            .partner(partner)
                            .length(10)
                            .width(5)
                            .build();

                    requestItems.add(requestItem);
                    requestItemRepo.save(requestItem);
                }));

                //-----------------------------Batch-----------------------------//
                positions.forEach(position -> {
                    for (int i = 1; i == 1; i++) {
                        if (requestItems.isEmpty()) {
                            break;
                        }

                        RequestItem requestItem = requestItems.remove(0);

                        Batch batch = Batch.builder()
                                .code("BATCH-" + i)
                                .equipmentQty(10 * i)
                                .createdDate(LocalDate.now())
                                .position(position)
                                .requestItem(requestItem)
                                .build();

                        batches.add(batch);
                        batchRepo.save(batch);
                    }
                });

                //-----------------------------BatchItem-----------------------------//
                batches.forEach(batch -> {
                    for (int i = 1; i <= 3; i++) {
                        BatchItem batchItem = BatchItem.builder()
                                .serialNumber("SN-" + i + "-" + batch.getCode())
                                .importedDate(LocalDate.now())
                                .batch(batch)
                                .build();
                        batchItems.add(batchItem);
                        batchItemRepo.save(batchItem);
                    }
                });

                //-----------------------------Task-----------------------------//
                itemGroups.forEach(group -> {
                    Task task = Task.builder()
                            .name("Task for " + group.getRequestApplication().getCode())
                            .code("TASK-" + group.getRequestApplication().getCode())
                            .description("Task description")
                            .status("ASSIGNED")
                            .user(accountRepo.findAll().stream().filter(acc -> acc.getRole().name().equalsIgnoreCase(Role.STAFF.name())).findFirst().get().getUser())
                            .assignedDate(LocalDate.now())
                            .itemGroup(group)
                            .build();
                    tasks.add(task);
                    taskRepo.save(task);
                });
            }
        };
    }
}
