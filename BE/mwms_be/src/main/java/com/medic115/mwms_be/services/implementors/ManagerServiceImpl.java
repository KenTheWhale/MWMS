package com.medic115.mwms_be.services.implementors;

import com.medic115.mwms_be.enums.CodeFormat;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.Type;
import com.medic115.mwms_be.models.Category;
import com.medic115.mwms_be.models.Equipment;
import com.medic115.mwms_be.models.ItemGroup;
import com.medic115.mwms_be.models.Partner;
import com.medic115.mwms_be.models.PartnerEquipment;
import com.medic115.mwms_be.models.RequestApplication;
import com.medic115.mwms_be.models.RequestItem;
import com.medic115.mwms_be.models.Task;
import com.medic115.mwms_be.models.User;
import com.medic115.mwms_be.repositories.CategoryRepo;
import com.medic115.mwms_be.repositories.EquipmentRepo;
import com.medic115.mwms_be.repositories.ItemGroupRepo;
import com.medic115.mwms_be.repositories.PartnerEquipmentRepo;
import com.medic115.mwms_be.repositories.PartnerRepo;
import com.medic115.mwms_be.repositories.RequestApplicationRepo;
import com.medic115.mwms_be.repositories.RequestItemRepo;
import com.medic115.mwms_be.repositories.TaskRepo;
import com.medic115.mwms_be.repositories.UserRepo;
import com.medic115.mwms_be.requests.AddCategoryRequest;
import com.medic115.mwms_be.requests.AddEquipmentRequest;
import com.medic115.mwms_be.requests.AddForUpdateRequest;
import com.medic115.mwms_be.requests.CancelImportRequest;
import com.medic115.mwms_be.requests.CreateImportRequest;
import com.medic115.mwms_be.requests.CreateTaskRequest;
import com.medic115.mwms_be.requests.DeleteCategoryRequest;
import com.medic115.mwms_be.requests.DeleteEquipmentRequest;
import com.medic115.mwms_be.requests.FilterRequestApplicationRequest;
import com.medic115.mwms_be.requests.GetRequestDetailRequest;
import com.medic115.mwms_be.requests.GetTaskByCodeRequest;
import com.medic115.mwms_be.requests.UpdateCategoryRequest;
import com.medic115.mwms_be.requests.UpdateEquipmentRequest;
import com.medic115.mwms_be.requests.UpdateImportRequest;
import com.medic115.mwms_be.requests.ViewEquipmentSupplierRequest;
import com.medic115.mwms_be.requests.ViewSupplierEquipmentRequest;
import com.medic115.mwms_be.response.ResponseObject;
import com.medic115.mwms_be.services.ManagerService;
import com.medic115.mwms_be.validations.CategoryValidation;
import com.medic115.mwms_be.validations.DeleteCategoryValidation;
import com.medic115.mwms_be.validations.UpdateCategoryValidation;
import com.medic115.mwms_be.validations.UpdateEquipmentValidation;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManagerServiceImpl implements ManagerService {

    RequestApplicationRepo requestApplicationRepo;

    RequestItemRepo requestItemRepo;

    TaskRepo taskRepo;

    EquipmentRepo equipmentRepo;

    CategoryRepo categoryRepo;

    ItemGroupRepo itemGroupRepo;

    PartnerEquipmentRepo partnerEquipmentRepo;

    UserRepo userRepo;

    PartnerRepo partnerRepo;

    //-----------------------------------------------CATEGORY-----------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> viewCategory() {
        List<Category> categories = categoryRepo.findAll();

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Get category successfully")
                        .data(MapToCategory(categories))
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> addCategory(AddCategoryRequest request) {
        String error = CategoryValidation.validateCategory(request, categoryRepo);
        if (error != null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(error)
                            .build()
            );
        }
        categoryRepo.save(
                Category.builder()
                        .code(request.getCode())
                        .name(request.getName())
                        .description(request.getDescription())
                        .build()
        );
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Add category successfully")
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> updateCategory(UpdateCategoryRequest request) {
        String error = UpdateCategoryValidation.validate(request, categoryRepo);
        if (error != null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(error)
                            .build()
            );
        }
        Category category = categoryRepo.findByCode(request.getCode());
        category.setCode(request.getCode());
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        categoryRepo.save(category);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Update category successfully")
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> deleteCategory(DeleteCategoryRequest request) {
        String error = DeleteCategoryValidation.validate(request, categoryRepo);
        if (error != null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(error)
                            .build()
            );
        }
        categoryRepo.deleteByCode(request.getCateCode());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Delete category successfully")
                        .build()
        );
    }

    private Object MapToCategory(List<Category> result) {
        return result.stream()
                .map(
                        category -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("id", category.getId());
                            item.put("name", category.getName());
                            item.put("code", category.getCode());
                            item.put("description", category.getDescription());
                            return item;
                        }
                )
                .toList();
    }

    //-----------------------------------------------EQUIPMENT-----------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> viewEquipment() {
        List<Equipment> equipments = equipmentRepo.findAll().stream()
                .filter(equipment -> equipment.getStatus().equals(Status.EQUIPMENT_ACTIVE.getValue()))
                .toList();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Get equipment successfully")
                        .data(MapToEquipment(equipments))
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> viewEquipmentSupplier(ViewEquipmentSupplierRequest request) {
        List<PartnerEquipment> peList = partnerEquipmentRepo.findAllByEquipment_Id(request.getEqId());
        List<Partner> result = peList.stream()
                .map(PartnerEquipment::getPartner)
                .filter(partner -> partner.getType().equals("supplier"))
                .distinct()
                .toList();

        if (result.isEmpty()) {
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("No supplier found for this equipment")
                    .success(false)
                    .data(null)
                    .build());
        }

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Supplier equipment retrieved successfully")
                .success(true)
                .data(result.stream()
                        .map(
                                partner -> {
                                    Map<String, Object> item = new HashMap<>();
                                    item.put("id", partner.getId());
                                    item.put("name", partner.getUser().getName());
                                    return item;
                                }
                        )
                        .toList())
                .build());
    }

    @Override
    public ResponseEntity<ResponseObject> viewSupplierEquipment(ViewSupplierEquipmentRequest request) {

        List<PartnerEquipment> peList = partnerEquipmentRepo.findAllByPartner_Id(request.getPartnerId());
        List<Equipment> equipmentList = peList.stream()
                .map(PartnerEquipment::getEquipment)
                .distinct()
                .toList();

        if (equipmentList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseObject.builder()
                            .message("No equipment found for this supplier")
                            .build());
        }

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Supplier equipment retrieved successfully")
                .data(MapToEquipment(equipmentList))
                .build());
    }

    @Override
    public ResponseEntity<ResponseObject> addEquipment(AddEquipmentRequest request) {
        Category category = categoryRepo.findById(request.getCategoryId()).orElse(null);
//        String error = CategoryValidation.validateCategory(request, equipmentRepo);
//        if (error != null) {
//            return ResponseEntity.badRequest().body(
//                    ResponseObject.builder()
//                            .message(error)
//                            .build()
//            );
//        }
        equipmentRepo.save(
                Equipment.builder()
                        .code(request.getCode())
                        .name(request.getName())
                        .description(request.getDescription())
                        .category(category)
                        .unit(request.getUnit())
                        .status(Status.EQUIPMENT_ACTIVE.getValue())
                        .build()
        );
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Add equipment successfully")
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> updateEquipment(UpdateEquipmentRequest request) {
        Category category = categoryRepo.findByName(request.getCategory());
        String error = UpdateEquipmentValidation.validate(request, equipmentRepo);
        if (error != null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(error)
                            .build()
            );
        }
        Equipment equipment = equipmentRepo.findByCode(request.getCode());
        equipment.setUnit(request.getUnit());
        equipment.setCategory(category);
        equipment.setName(request.getName());
        equipment.setDescription(request.getDescription());
        equipmentRepo.save(equipment);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Update category successfully")
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> deleteEquipment(DeleteEquipmentRequest request) {
//        String error = DeleteCategoryValidation.validate(request, categoryRepo);
//        if (error != null) {
//            return ResponseEntity.badRequest().body(
//                    ResponseObject.builder()
//                            .message(error)
//                            .build()
//            );
//        }
        equipmentRepo.findByCode(request.getCode()).setStatus(Status.EQUIPMENT_DELETED.getValue());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Delete equipment successfully")
                        .build()
        );
    }

    private Object MapToEquipment(List<Equipment> result) {
        return result.stream()
                .map(
                        equipment -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("id", equipment.getId());
                            item.put("name", equipment.getName());
                            item.put("code", equipment.getCode());
                            item.put("description", equipment.getDescription());
                            item.put("quantity", getEquipmentQuantity(equipment.getId()));
                            item.put("unit", equipment.getUnit());
                            item.put("category", equipment.getCategory().getName());
                            item.put("status", equipment.getStatus());
                            return item;
                        }
                )
                .toList();
    }

    private int getEquipmentQuantity(int equipmentId) {
        return requestItemRepo.findAll().stream()
                .filter(requestItem -> requestItem.getEquipment().getId() == equipmentId)
                .filter(requestItem -> requestItem.getBatch() != null)
                .map(RequestItem::getQuantity)
                .reduce(0, Integer::sum);
    }

    //-----------------------------------------------TASK-----------------------------------------------//

    @Override
    public ResponseEntity<ResponseObject> getTaskList() {
        List<Map<String, Object>> data = taskRepo.findAll().stream()
                .filter(task -> !task.getStatus().equalsIgnoreCase(Status.TASK_DELETE.getValue()))
                .map(task -> {
                    Map<String, Object> dataItem = new HashMap<>();
                    dataItem.put("id", task.getId());
                    dataItem.put("code", task.getCode());
                    dataItem.put("assignDate", task.getAssignedDate());
                    dataItem.put("staff", task.getUser().getName());
                    dataItem.put("partner", task.getItemGroup().getRequestItems().get(0).getPartner().getUser().getName());
                    dataItem.put("description", task.getDescription());
                    dataItem.put("status", task.getStatus());
                    return dataItem;
                })
                .toList();

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(data)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> deleteTask(int id) {
        Task task = taskRepo.findById(id).orElse(null);
        if (task == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Task not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        if (!task.getAssignedDate().isAfter(LocalDate.now())) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Can not delete today task or before")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        task.setStatus(Status.TASK_DELETE.getValue());
        task.getItemGroup().setStatus(Status.GROUP_ACCEPTED.getValue());
        taskRepo.save(task);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Delete task successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> createTask(CreateTaskRequest request) {
        User staff = userRepo.findById(request.getStaffId()).orElse(null);
        if (staff == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Staff not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        ItemGroup group = itemGroupRepo.findById(request.getGroupId()).orElse(null);
        if (group == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Group not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        boolean flag = false;
        List<Task> tasks = taskRepo.findAll();
        for (Task t : tasks) {
            if (t.getItemGroup().getId().equals(request.getGroupId())) {
                t.setStatus(Status.TASK_ASSIGNED.getValue());
                t.setDescription(request.getDescription());
                t.setAssignedDate(group.getDeliveryDate());
                t.setUser(staff);
                taskRepo.save(t);
                flag = true;
            }
        }
        Task task = tasks.get(tasks.size() - 1);
        if (!flag) {
            taskRepo.save(
                    Task.builder()
                            .assignedDate(group.getDeliveryDate())
                            .code(CodeFormat.TASK.getValue() + (task.getId() + 1))
                            .itemGroup(group)
                            .user(staff)
                            .description(request.getDescription())
                            .status(Status.TASK_ASSIGNED.getValue())
                            .build()
            );
        }
        group.setStatus(Status.GROUP_PROCESSING.getValue());
        itemGroupRepo.save(group);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Assigned staff successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> getTaskByCode(GetTaskByCodeRequest request) {
        Task task = taskRepo.findByCode(request.getCode()).orElse(null);
        if(task == null){
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Task not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", task.getId());
        data.put("code", task.getCode());
        data.put("assignDate", task.getAssignedDate());
        data.put("staff", task.getUser().getName());
        data.put("description", task.getDescription());
        data.put("status", task.getStatus());
        data.put("group", getItemGroupFromTask(task));

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Get task successfully")
                        .success(true)
                        .data(data)
                        .build()
        );
    }

    private Map<String, Object> getItemGroupFromTask(Task task) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", task.getItemGroup().getId());
        data.put("cName", task.getItemGroup().getCarrierName());
        data.put("cPhone", task.getItemGroup().getCarrierPhone());
        data.put("delivery", task.getItemGroup().getDeliveryDate());
        data.put("status", task.getItemGroup().getStatus());
        data.put("request", getRequestDataFromGroup(task.getItemGroup()));
        data.put("items", getItemDataFromGroup(task.getItemGroup()));
        return data;
    }

    //-----------------------------------------------STAFF-----------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> getStaffs() {
        List<Map<String, Object>> data = userRepo.findAll().stream()
                .filter(user -> user.getAccount().getRole().equals(Role.STAFF))
                .map(
                        staff -> {
                            Map<String, Object> dataItem = new HashMap<>();
                            dataItem.put("id", staff.getId());
                            dataItem.put("name", staff.getName());
                            dataItem.put("email", staff.getEmail());
                            dataItem.put("phone", staff.getPhone());
                            return dataItem;
                        }
                ).toList();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(data)
                        .build()
        );
    }

    //-----------------------------ITEM GROUP-----------------------------//

    @Override
    public ResponseEntity<ResponseObject> getUnassignedGroups() {
        List<Map<String, Object>> data = itemGroupRepo.findAll().stream()
                .filter(itemGroup -> itemGroup.getStatus().equalsIgnoreCase(Status.GROUP_ACCEPTED.getValue()))
                .map(itemGroup -> {
                    Map<String, Object> dataItem = new HashMap<>();
                    dataItem.put("id", itemGroup.getId());
                    dataItem.put("cName", itemGroup.getCarrierName());
                    dataItem.put("cPhone", itemGroup.getCarrierPhone());
                    dataItem.put("delivery", itemGroup.getDeliveryDate());
                    dataItem.put("status", itemGroup.getStatus());
                    dataItem.put("request", getRequestDataFromGroup(itemGroup));
                    dataItem.put("items", getItemDataFromGroup(itemGroup));
                    return dataItem;
                })
                .toList();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(data)
                        .build()
        );
    }

    private Map<String, Object> getRequestDataFromGroup(ItemGroup itemGroup) {
        Map<String, Object> requestApplication = new HashMap<>();
        requestApplication.put("id", itemGroup.getRequestApplication().getId());
        requestApplication.put("code", itemGroup.getRequestApplication().getCode());
        requestApplication.put("type", itemGroup.getRequestApplication().getType());
        requestApplication.put("requestDate", itemGroup.getRequestApplication().getRequestDate());
        return requestApplication;
    }

    private List<Map<String, Object>> getItemDataFromGroup(ItemGroup itemGroup) {
        DecimalFormat df = new DecimalFormat("#.##");

        return requestItemRepo.findAll().stream()
                .filter(item -> item.getItemGroup().getId().equals(itemGroup.getId()))
                .map(
                        item -> {
                            Map<String, Object> dataItem = new HashMap<>();
                            dataItem.put("id", item.getId());
                            dataItem.put("equipment", item.getEquipment().getName());
                            dataItem.put("category", item.getEquipment().getCategory().getName());
                            dataItem.put("partner", item.getPartner().getUser().getName());
                            dataItem.put("quantity", item.getQuantity());
                            dataItem.put("unitPrice", df.format(item.getUnitPrice()));
                            return dataItem;
                        }
                ).toList();
    }


    //-----------------------------------------------REQUEST-----------------------------------------------//

    @Override
    public ResponseEntity<ResponseObject> getAllRequestImport() {

        List<Map<String, Object>> data = requestApplicationRepo.findAll().stream()
                .filter(requestApplication -> "import".equals(requestApplication.getType()))
                .map(
                        requestImport -> {
                            Map<String, Object> request = new HashMap<>();
                            request.put("code", requestImport.getCode());
                            request.put("requestDate", requestImport.getRequestDate());
                            request.put("lastModifiedDate", requestImport.getLastModifiedDate());
                            return request;
                        }
                ).toList();
        if (!data.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject
                            .builder()
                            .message("Get All Import Request successfully")
                            .data(data)
                            .build()
            );
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    ResponseObject
                            .builder()
                            .message("List Import Request Empty")
                            .data("")
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getAllRequestExport() {
        List<Map<String, Object>> data = requestApplicationRepo.findAll().stream()
                .filter(requestApplication -> "export".equals(requestApplication.getType()))
                .map(
                        requestExport -> {
                            Map<String, Object> request = new HashMap<>();
                            request.put("code", requestExport.getCode());
                            request.put("requestDate", requestExport.getRequestDate());
                            request.put("lastModifiedDate", requestExport.getLastModifiedDate());
                            return request;
                        }
                ).toList();
        if (!data.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject
                            .builder()
                            .message("Get All Export Request successfully")
                            .data(data)
                            .build()
            );
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    ResponseObject
                            .builder()
                            .message("List Export Request Empty")
                            .data("")
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> filterRequestByRequestDate(FilterRequestApplicationRequest request) {
        List<Map<String, Object>> data = requestApplicationRepo.findAllByRequestDate(request.getRequestDate()).stream()
                .map(
                        requestApplication -> {
                            Map<String, Object> requestfilter = new HashMap<>();
                            requestfilter.put("code", requestApplication.getCode());
                            requestfilter.put("requestDate", requestApplication.getRequestDate());
                            requestfilter.put("lastModifiedDate", requestApplication.getLastModifiedDate());
                            return requestfilter;
                        }
                ).toList();
        if (!data.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject
                            .builder()
                            .message("200 OK")
                            .data(data)
                            .build()
            );
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    ResponseObject
                            .builder()
                            .message("204 No Content")
                            .data("")
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> createImportRequest(CreateImportRequest request) {
        RequestApplication requestApplication = RequestApplication
                .builder()
                .code(generateRequestCode())
                .requestDate(LocalDate.now())
                .lastModifiedDate(LocalDate.now())
                .type(Type.REQUEST_IMPORT.getValue())
                .build();

        requestApplicationRepo.save(requestApplication);

        List<CreateImportRequest.RequestItemList> sortedItems = new ArrayList<>(request.getRequestItemList());
        sortedItems.sort(Comparator.comparingInt(CreateImportRequest.RequestItemList::getPartnerId));

        List<ItemGroup> itemGroups = new ArrayList<>();
        List<RequestItem> requestItems = new ArrayList<>();

        int currentPartnerId = 0;
        ItemGroup currentGroup = null;

        List<RequestItem> itemsInCurrentGroup = new ArrayList<>();

        for (CreateImportRequest.RequestItemList item : sortedItems) {
            if (item.getPartnerId() != currentPartnerId) {
                if (currentGroup != null) {
                    currentGroup.setRequestItems(new ArrayList<>(itemsInCurrentGroup));
                    itemGroups.add(currentGroup);
                }

                currentGroup = ItemGroup.builder()
                        .requestApplication(requestApplication)
                        .deliveryDate(null)
                        .carrierName("")
                        .carrierPhone("")
                        .status(Status.REQUEST_PENDING.getValue())
                        .build();
                currentGroup = itemGroupRepo.save(currentGroup);

                currentPartnerId = item.getPartnerId();
                itemsInCurrentGroup.clear();
            }

            RequestItem requestItem = RequestItem.builder()
                    .quantity(item.getQuantity())
                    .unitPrice(0)
                    .equipment(equipmentRepo.findById(item.getEquipmentId()).orElse(null))
                    .partner(partnerRepo.findById(item.getPartnerId()).orElse(null))
                    .itemGroup(currentGroup)
                    .build();

            requestItems.add(requestItem);
            itemsInCurrentGroup.add(requestItem);
        }

        if (currentGroup != null) {
            currentGroup.setRequestItems(new ArrayList<>(itemsInCurrentGroup));
            itemGroups.add(currentGroup);
        }

        requestItemRepo.saveAll(requestItems);
        itemGroupRepo.saveAll(itemGroups);

        requestApplication.setItemGroups(itemGroups);
        requestApplicationRepo.save(requestApplication);

        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("Created Application successfully")
                        .build()
        );
    }


    @Override
    public ResponseEntity<ResponseObject> getRequestDetailByCode(GetRequestDetailRequest request) {
        RequestApplication requestApplication = requestApplicationRepo.findAll().stream()
                .filter(r -> r.getCode().equals(request.getCode())).findFirst().orElse(null);

        if (requestApplication == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    ResponseObject.builder()
                            .message("Dont have request application with code " + request.getCode())
                            .data(null)
                            .build()
            );
        }

        Map<String, Object> requestDetail = new HashMap<>();
        requestDetail.put("code", requestApplication.getCode());
        requestDetail.put("requestDate", requestApplication.getRequestDate());
        requestDetail.put("lastModified", requestApplication.getLastModifiedDate());

        List<Map<String, Object>> itemGroupList = requestApplication.getItemGroups().stream()
                .map(group -> {
                    Map<String, Object> groupDetail = new HashMap<>();

                    groupDetail.put("groupId", group.getId());
                    groupDetail.put("deliveryDate", group.getDeliveryDate());
                    groupDetail.put("carrierName", group.getCarrierName());
                    groupDetail.put("carrierPhone", group.getCarrierPhone());
                    groupDetail.put("status", group.getStatus());

                    List<Map<String, Object>> requestItemList = group.getRequestItems().stream()
                            .map(
                                    item -> {
                                        Map<String, Object> itemDetail = new HashMap<>();
                                        itemDetail.put("itemId", item.getId());
                                        itemDetail.put("eqId", item.getEquipment().getId());
                                        itemDetail.put("equipmentName", item.getEquipment().getName());
                                        itemDetail.put("equipmentDescription", item.getEquipment().getDescription());
                                        itemDetail.put("quantity", item.getQuantity());
                                        itemDetail.put("unit", item.getEquipment().getUnit());

                                        if (item.getPartner() != null) {
                                            groupDetail.put("partnerId", item.getPartner().getId());
                                            groupDetail.put("partner", item.getPartner().getUser().getName());
                                        }
                                        return itemDetail;
                                    }).toList();
                    groupDetail.put("requestItems", requestItemList);
                    return groupDetail;
                }).toList();

        requestDetail.put("itemGroups", itemGroupList);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("get Request Detail successfully")
                        .data(requestDetail)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> cancelImportRequest(CancelImportRequest request) {
        ItemGroup itemGroup = itemGroupRepo.findById(request.getGroupId()).orElse(null);

        if (itemGroup == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    ResponseObject
                            .builder()
                            .message("204 No Content Item group not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        itemGroup.setStatus(Status.REQUEST_CANCELLED.getValue());
        itemGroupRepo.save(itemGroup);
        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("200 OK Cancel Group successfully")
                        .success(true)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> updateImportRequest(UpdateImportRequest request) {

        RequestItem requestItem = requestItemRepo.findById(request.getRequestItemId()).orElse(null);
        if (requestItem == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    ResponseObject
                            .builder()
                            .message("204 No Content")
                            .data(null)
                            .build()
            );
        }
        if (requestItem.getEquipment().getId() != request.getEquipmentId()) {
            Equipment equipment = equipmentRepo.findById(request.getEquipmentId()).orElse(null);
            requestItem.setEquipment(equipment);
        }
        requestItem.setQuantity(request.getQuantity());
        requestItemRepo.save(requestItem);
        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("200 OK Updated item successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> addForUpdateRequest(AddForUpdateRequest request) {
        ItemGroup itemGroup = itemGroupRepo.findById(request.getGroupId()).orElse(null);
        Partner partner = partnerRepo.findById(request.getPartnerId()).orElse(null);
        Equipment equipment = equipmentRepo.findById(request.getEquipmentId()).orElse(null);

        if (request.getQuantity() < 0) {
            return ResponseEntity.ok().body(
                    ResponseObject
                            .builder()
                            .success(false)
                            .message("quantity must be greater than 0")
                            .data(null)
                            .build()
            );
        }

        RequestItem requestItem = RequestItem
                .builder()
                .equipment(equipment)
                .partner(partner)
                .itemGroup(itemGroup)
                .quantity(request.getQuantity())
                .build();

        requestItemRepo.save(requestItem);
        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("200 OK Add item for update successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }


    @Override
    public ResponseEntity<ResponseObject> getListSupplier() {

        List<Map<String, Object>> partnerList = partnerRepo.findAll().stream().filter(p -> p.getType().equals("supplier"))
                .map(supplier -> {
                            Map<String, Object> partnerDetail = new HashMap<>();
                            partnerDetail.put("partnerName", supplier.getUser().getName());
                            partnerDetail.put("partnerId", supplier.getId());
                            return partnerDetail;
                        }

                ).toList();
        if (partnerList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                    ResponseObject
                            .builder()
                            .message("204 No Content - don't have any supplier")
                            .build()
            );
        }

        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("200 OK")
                        .data(partnerList)
                        .build()
        );
    }


    //-----------------------------PRIVATE FUNCTIONS-----------------------------//
    private String generateRequestCode() {
        RequestApplication lastRequest = requestApplicationRepo.findTopByOrderByIdDesc();

        if (lastRequest == null) {
            return "REQ-1";
        }
        String lastCode = lastRequest.getCode();
        int lastNumber = Integer.parseInt(lastCode.replace("REQ-", ""));
        return "REQ-" + (lastNumber + 1);
    }
}
