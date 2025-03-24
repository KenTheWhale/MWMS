package com.medic115.mwms_be.services.implementors;

import com.medic115.mwms_be.enums.CodeFormat;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.Type;
import com.medic115.mwms_be.models.*;
import com.medic115.mwms_be.repositories.*;
import com.medic115.mwms_be.requests.*;
import com.medic115.mwms_be.response.ResponseObject;
import com.medic115.mwms_be.services.ManagerService;
import com.medic115.mwms_be.utils.ResponseUtil;
import com.medic115.mwms_be.validations.CategoryValidation;
import com.medic115.mwms_be.validations.DeleteEquipmentValidation;
import com.medic115.mwms_be.validations.UpdateCategoryValidation;
import com.medic115.mwms_be.validations.UpdateEquipmentValidation;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;

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

    BatchRepo batchRepo;

    //-----------------------------------------------CATEGORY-----------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> viewCategory() {
        List<Category> categories = categoryRepo.findAll().stream()
                .filter(cate -> cate.getStatus().equals(Status.CATEGORY_ACTIVE.getValue()))
                .toList();

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .success(true)
                        .message("Get category successfully")
                        .data(MapToCategory(categories))
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> addCategory(AddCategoryRequest request) {
        String error = CategoryValidation.validateCategory(request, categoryRepo);
        if (error != null) {
            return ResponseEntity.ok().body(ResponseObject.builder()
                    .success(false)
                    .message(error)
                    .build()
            );
        }
        categoryRepo.save(
                Category.builder()
                        .code(request.getCode())
                        .name(request.getName())
                        .description(request.getDescription())
                        .status(Status.CATEGORY_ACTIVE.getValue())
                        .build()
        );
        return ResponseEntity.ok().body(ResponseObject.builder()
                .success(true)
                .message("Add category successfully")
                .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> updateCategory(UpdateCategoryRequest request) {
        String error = UpdateCategoryValidation.validate(request, categoryRepo);
        if (error != null) {
            return ResponseEntity.ok().body(ResponseObject.builder()
                    .success(false)
                    .message(error)
                    .build()
            );
        }
        Category category = categoryRepo.findByCode(request.getCode());
        category.setCode(request.getCode());
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        categoryRepo.save(category);
        return ResponseEntity.ok().body(ResponseObject.builder()
                .success(true)
                .message("Update category successfully")
                .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> deleteCategory(String code) {
//        String error = DeleteCategoryValidation.validate(request, categoryRepo);
//        if (error != null) {
//            return ResponseEntity.ok().body(ResponseObject.builder()
//                    .success(false)
//                    .message(error)
//                    .build()
//            );
//        }
        Category category = categoryRepo.findByCode(code);
        category.setStatus(Status.CATEGORY_DELETED.getValue());
        categoryRepo.save(category);
        return ResponseEntity.ok().body(ResponseObject.builder()
                .success(true)
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
                            item.put("status", category.getStatus());
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
        return ResponseEntity.ok().body(ResponseObject.builder()
                .success(true)
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
            return ResponseEntity.ok().body(ResponseObject.builder()
                    .message("No supplier found for this equipment")
                    .success(false)
                    .data(null)
                    .build());
        }

        return ResponseEntity.ok().body(ResponseObject.builder()
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
            return ResponseEntity.ok().body(ResponseObject.builder()
                    .success(false)
                    .message("No equipment found for this supplier")
                    .build());
        }

        return ResponseEntity.ok().body(ResponseObject.builder()
                .success(true)
                .message("Supplier equipment retrieved successfully")
                .data(MapToEquipment(equipmentList))
                .build());
    }

    @Override
    public ResponseEntity<ResponseObject> addEquipment(AddEquipmentRequest request) {
        Category category = categoryRepo.findById(request.getCategoryId()).orElse(null);
//        String error = CategoryValidation.validateCategory(request, equipmentRepo);
//        if (error != null) {
//            return ResponseEntity.ok().body(
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
                        .success(true)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> updateEquipment(UpdateEquipmentRequest request) {
        Category category = categoryRepo.findById(request.getCategoryId()).orElse(null);
        String error = UpdateEquipmentValidation.validate(request, equipmentRepo);
        if (error != null) {
            return ResponseEntity.ok().body(ResponseObject.builder()
                            .success(false)
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
        return ResponseEntity.ok().body(ResponseObject.builder()
                .success(true)
                .message("Update category successfully")
                .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> deleteEquipment(String code) {
        String error = DeleteEquipmentValidation.validate(code, equipmentRepo);
        if (error != null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .success(false)
                            .message(error)
                            .build()
            );
        }
        Equipment equipment = equipmentRepo.findByCode(code);
        equipment.setStatus(Status.EQUIPMENT_DELETED.getValue());
        equipmentRepo.save(equipment);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .success(true)
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
                    dataItem.put("type", task.getType());
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
        ItemGroup item = task.getItemGroup();
        task.setItemGroup(null);
        taskRepo.save(task);
        item.setStatus(Status.GROUP_ACCEPTED.getValue());
        itemGroupRepo.save(item);
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

        List<Task> tasks = taskRepo.findAll();

        int newCodeValue = tasks.isEmpty() ? 1 : Integer.parseInt(tasks.get(tasks.size() - 1).getCode().split("-")[1]) + 1;

        taskRepo.save(
                Task.builder()
                        .assignedDate(group.getDeliveryDate())
                        .code(CodeFormat.TASK.getValue() + newCodeValue)
                        .itemGroup(group)
                        .user(staff)
                        .type(Type.TASK_IMPORT.getValue())
                        .description(request.getDescription())
                        .status(Status.TASK_ASSIGNED.getValue())
                        .build()
        );
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
        if (task == null) {
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
        data.put("type", task.getType());
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
                .filter(user ->
                        user.getAccount().getRole().equals(Role.STAFF)
                        && user.getTasks().stream().filter(
                                task -> task.getStatus().equalsIgnoreCase(Status.TASK_ASSIGNED.getValue())
                        ).toList().size() < 5
                )
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

        return requestItemRepo.findAll().stream()
                .filter(item -> item.getItemGroup().getId().equals(itemGroup.getId()))
                .map(
                        item -> {
                            Map<String, Object> dataItem = new HashMap<>();
                            dataItem.put("id", item.getId());
                            dataItem.put("equipment", item.getEquipment().getName());
                            dataItem.put("category", item.getEquipment().getCategory().getName());
                            dataItem.put("unit", item.getEquipment().getUnit());
                            dataItem.put("partner", item.getPartner().getUser().getName());
                            dataItem.put("quantity", item.getQuantity());
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
                .map(requestExport -> {
                    Map<String, Object> request = new HashMap<>();
                    request.put("code", requestExport.getCode());
                    request.put("requestDate", requestExport.getRequestDate());
                    request.put("lastModifiedDate", requestExport.getLastModifiedDate());

                    List<String> partnerNames = requestExport.getItemGroups().stream()
                            .flatMap(group -> group.getRequestItems().stream())
                            .map(item -> item.getPartner().getUser().getName())
                            .distinct()
                            .toList();

                    request.put("partnerNames", partnerNames);
                    return request;
                })
                .toList();

        return data.isEmpty()
                ? ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ResponseObject.builder()
                        .message("List Export Request Empty")
                        .success(false)
                        .data("")
                        .build()
        )
                : ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Get All Export Request successfully")
                        .success(true)
                        .data(data)
                        .build()
        );
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
    public ResponseEntity<ResponseObject> approveExportRequest(ApproveExportRequest request) {

        RequestApplication requestExport = requestApplicationRepo.findByCode(request.getCode());
        if (requestExport == null) {
            return ResponseEntity.ok().body(
                    ResponseObject
                            .builder()
                            .message("Dont have request application with code " + request.getCode())
                            .build()
            );
        }


        return null;
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

    public ResponseEntity<ResponseObject> viewImportHistory() {
        List<Map<String, Object>> requestItems = requestItemRepo.findAll().stream()
                .filter(item -> item.getItemGroup().getStatus().equalsIgnoreCase(Status.GROUP_STORED.getValue()))
                .filter(item -> item.getItemGroup().getRequestApplication().getType().equalsIgnoreCase(Type.REQUEST_IMPORT.getValue()))
                .map(item -> {
                            Map<String, Object> requestItemsDetail = new HashMap<>();
                            requestItemsDetail.put("code", item.getItemGroup().getRequestApplication().getCode());
                            requestItemsDetail.put("partner", item.getPartner().getUser().getName());
                            requestItemsDetail.put("requestDate", item.getItemGroup().getRequestApplication().getRequestDate());
                            requestItemsDetail.put("deliveryDate", item.getItemGroup().getDeliveryDate());
                            requestItemsDetail.put("equipment", item.getEquipment().getName());
                            requestItemsDetail.put("requestQty", item.getQuantity());
                            requestItemsDetail.put("batchQty", item.getBatch().getBatchItems().size());
                            requestItemsDetail.put("position", item.getBatch().getPosition().getName());
                            requestItemsDetail.put("area", item.getBatch().getPosition().getArea().getName());

                            Map<String, Object> historyDetail = new HashMap<>();


                            Map<String, Object> batch = new HashMap<>();
                            if (item.getBatch() != null) {
                                batch.put("code", item.getBatch().getCode());
                                batch.put("position", item.getBatch().getPosition().getName());
                                batch.put("area", item.getBatch().getPosition().getArea().getName());
                                List<Map<String, Object>> batchItems = item.getBatch().getBatchItems().stream().map(
                                        batchItem -> {
                                            Map<String, Object> batchItemDetail = new HashMap<>();
                                            batchItemDetail.put("serial", batchItem.getSerialNumber());
                                            return batchItemDetail;
                                        }
                                ).toList();
                                batch.put("items", batchItems);
                                historyDetail.put("batch", batch);
                            }

                            Map<String, Object> itemDetail = new HashMap<>();
                            itemDetail.put("equipment", item.getEquipment().getName());
                            itemDetail.put("quantity", item.getQuantity());
                            itemDetail.put("partner", item.getPartner().getUser().getName());
                            historyDetail.put("requestItems", itemDetail);

                            Map<String, Object> task = new HashMap<>();
                            task.put("code", item.getItemGroup().getTask().getCode());
                            task.put("staff", item.getItemGroup().getTask().getUser().getName());
                            task.put("assigned", item.getItemGroup().getTask().getAssignedDate());

                            historyDetail.put("task", task);
                            requestItemsDetail.put("historyDetail", historyDetail);

                            return requestItemsDetail;
                        }
                ).toList();
        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message(" Viewing history successfully")
                        .success(true)
                        .data(requestItems)
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

    //-----------------------------BATCH-----------------------------//


    @Override
    public ResponseEntity<ResponseObject> getAllBatch() {
        return ResponseUtil.build(HttpStatus.OK, "", true, getBatchList());
    }

    private List<Map<String, Object>> getBatchList() {
        return batchRepo.findAll().stream()
                .map(
                        batch -> {
                            Map<String, Object> data = new HashMap<>();
                            data.put("id", batch.getId());
                            data.put("code", batch.getCode());
                            data.put("createdDate", batch.getCreatedDate());
                            data.put("length", batch.getLength());
                            data.put("width", batch.getWidth());
                            data.put("qty", batch.getBatchItems().size());
                            data.put("location", getLocationFromBatch(batch));
                            data.put("request", getRequestFromBatch(batch));
                            data.put("items", getItemsFromBatch(batch));
                            return data;
                        }
                )
                .toList();
    }

    private Map<String, Object> getLocationFromBatch(Batch batch) {
        Map<String, Object> location = new HashMap<>();
        location.put("areaName", batch.getPosition().getArea().getName());
        location.put("positionName", batch.getPosition().getName());
        return location;
    }

    private Map<String, Object> getRequestFromBatch(Batch batch) {
        RequestItem item = batch.getRequestItem();
        Map<String, Object> request = new HashMap<>();
        request.put("id", item.getId());
        request.put("partner", item.getPartner().getUser().getName());
        request.put("group", getGroupFromItem(item));
        request.put("equipment", getEquipmentFromItem(item));
        return request;
    }

    private Map<String, Object> getGroupFromItem(RequestItem item) {
        ItemGroup group = item.getItemGroup();
        Map<String, Object> groupItem = new HashMap<>();
        groupItem.put("id", group.getId());
        groupItem.put("cName", group.getCarrierName());
        groupItem.put("cPhone", group.getCarrierPhone());
        groupItem.put("delivery", group.getDeliveryDate());
        groupItem.put("request", getRequestApplicationFromGroup(group));
        return groupItem;
    }

    private Map<String, Object> getRequestApplicationFromGroup(ItemGroup group) {
        RequestApplication request = group.getRequestApplication();
        Map<String, Object> requestApplication = new HashMap<>();
        requestApplication.put("id", request.getId());
        requestApplication.put("code", request.getCode());
        requestApplication.put("requestDate", request.getRequestDate());
        return requestApplication;
    }

    private Map<String, Object> getEquipmentFromItem(RequestItem item) {
        Equipment equipment = item.getEquipment();
        Map<String, Object> data = new HashMap<>();
        data.put("id", equipment.getId());
        data.put("code", equipment.getCode());
        data.put("name", equipment.getName());
        data.put("unit", equipment.getUnit());
        data.put("category", equipment.getCategory().getName());
        data.put("description", equipment.getDescription());
        return data;
    }

    private List<Map<String, Object>> getItemsFromBatch(Batch batch) {
        return batch.getBatchItems().stream().map(
                item -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("serial", item.getSerialNumber());
                    return data;
                }
        ).toList();
    }

    //-----------------------------DASHBOARD-----------------------------//
    @Override
    public ResponseEntity<ResponseObject> getDashboardData() {
        return ResponseUtil.build(HttpStatus.OK, "", true, getData());
    }

    private Map<String, Object> getData() {
        Map<String, Object> data = new HashMap<>();
        data.put("number", getDataNumberInMonth());
        data.put("chart", getDataChart());
        return data;
    }

    private Map<String, Object> getDataNumberInMonth() {
        Map<String, Object> data = new HashMap<>();
        data.put("batch", getImportedBatchAmount());
        data.put("task", getCompletedTaskAmount());
        data.put("peRequest", getRequestAmountBaseOnStatus(Status.GROUP_PENDING.getValue()));
        data.put("acRequest", getRequestAmountBaseOnStatus(Status.GROUP_ACCEPTED.getValue()));
        data.put("prRequest", getRequestAmountBaseOnStatus(Status.GROUP_PROCESSING.getValue()));
        data.put("stRequest", getRequestAmountBaseOnStatus(Status.GROUP_STORED.getValue()));
        data.put("reRequest", getRequestAmountBaseOnStatus(Status.GROUP_REJECTED.getValue()));
        data.put("caRequest", getRequestAmountBaseOnStatus(Status.GROUP_CANCELLED.getValue()));
        return data;
    }

    private int getImportedBatchAmount() {
        return batchRepo.findAll().stream()
                .filter(batch -> batch.getCreatedDate().getMonth()
                        .equals(LocalDate.now().getMonth())
                )
                .toList()
                .size();
    }

    private int getCompletedTaskAmount() {
        return taskRepo.findAll().stream()
                .filter(task -> task.getAssignedDate().getMonth()
                        .equals(LocalDate.now().getMonth())
                        && task.getStatus()
                        .equalsIgnoreCase(Status.TASK_COMPLETED.getValue())
                ).toList().size();
    }

    private int getRequestAmountBaseOnStatus(String status) {
        return itemGroupRepo.findAll().stream()
                .filter(group -> group.getStatus()
                        .equalsIgnoreCase(status)
                        && group.getRequestApplication().getRequestDate().getMonth()
                        .equals(LocalDate.now().getMonth())

                )
                .toList().size();
    }

    private Map<String, Object> getDataChart() {
        Map<String, Object> data = new HashMap<>();
        data.put("equipment", getTopImportedEquipment());
        data.put("request", getMonthlyImportedAcceptedRequest());
        return data;
    }

    private List<Map<String, Object>> getTopImportedEquipment() {
        List<Equipment> equipments = equipmentRepo.findAll();List<Map<String, Object>> dataSet = new ArrayList<>();
        for (Equipment equipment : equipments) {
            int count = 0;
            Map<String, Object> data = new HashMap<>();
            List<RequestItem> items = equipment.getRequestItems();
            for (RequestItem item : items) {
                if(item.getBatch() != null){
                    count++;
                }
            }
            data.put("name", equipment.getName());
            data.put("qty", count);
            dataSet.add(data);
        }

        return dataSet.stream()
                .sorted(Comparator.comparingInt(m -> {
                    Integer qty = (Integer) ((Map<String, Object>) m).get("qty");
                    return Optional.ofNullable(qty).orElse(0);
                }).reversed())
                .limit(5)
                .toList();
    }

    private List<Map<String, Object>> getMonthlyImportedAcceptedRequest() {
        List<Month> months = new ArrayList<>();
        LocalDate last3Months = LocalDate.now().minusMonths(4);

        while (!last3Months.isAfter(LocalDate.now())) {
            months.add(last3Months.getMonth());
            last3Months = last3Months.plusMonths(1);
        }

        List<Map<String, Object>> dataSet = new ArrayList<>();
        for(Month month : months){
            Map<String, Object> data = new HashMap<>();
            data.put("month", month.getDisplayName(TextStyle.FULL, Locale.getDefault()));
            data.put("qty",getRequestByMonth(month));
            dataSet.add(data);
        }
        return dataSet;
    }

    private int getRequestByMonth(Month month){
        return itemGroupRepo.findAll().stream().filter(
                group -> group.getRequestApplication().getRequestDate().getMonth().equals(month)
                && (group.getStatus().equalsIgnoreCase(Status.GROUP_ACCEPTED.getValue())
                        || group.getStatus().equalsIgnoreCase(Status.GROUP_PROCESSING.getValue())
                        || group.getStatus().equalsIgnoreCase(Status.GROUP_STORED.getValue())
                )
        ).toList().size();
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
