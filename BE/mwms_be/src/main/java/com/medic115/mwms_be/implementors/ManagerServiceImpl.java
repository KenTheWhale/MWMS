package com.medic115.mwms_be.implementors;

import com.medic115.mwms_be.dto.requests.*;
import com.medic115.mwms_be.dto.response.*;
import com.medic115.mwms_be.enums.CodeFormat;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.models.*;
import com.medic115.mwms_be.repositories.*;
import com.medic115.mwms_be.services.ManagerService;
import com.medic115.mwms_be.validations.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManagerServiceImpl implements ManagerService {

    AccountRepo accountRepo;

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

    @Override
    public ResponseEntity<ResponseObject> searchCategory(SearchRequest request) {
        if (request.getKeyword() == null || request.getKeyword().isBlank()) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message("Keyword cannot be empty")
                    .build());
        }

        List<Category> result = categoryRepo.findAll().stream()
                .filter(cate -> cate.getName().toLowerCase().contains(request.getKeyword().toLowerCase())
                        || cate.getCode().toLowerCase().contains(request.getKeyword().toLowerCase()))
                .toList();

        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseObject.builder()
                            .message("No equipment found")
                            .build());
        }

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Search successful")
                .data(MapToCategory(result))
                .build());
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
                        .price(request.getPrice())
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
        equipment.setPrice(request.getPrice());
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
        equipmentRepo.deleteByCode(request.getCode());
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Delete equipment successfully")
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> searchEquipment(SearchRequest request) {
        if (request.getKeyword() == null || request.getKeyword().isBlank()) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message("Keyword cannot be empty")
                    .build());
        }

        List<Equipment> result = equipmentRepo.findAll().stream()
                .filter(equipment -> equipment.getName().toLowerCase().contains(request.getKeyword().toLowerCase())
                        || equipment.getCode().toLowerCase().contains(request.getKeyword().toLowerCase()))
                .toList();

        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseObject.builder()
                            .message("No equipment found")
                            .build());
        }

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Search successful")
                .data(MapToEquipment(result))
                .build());
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
                            item.put("unit", equipment.getUnit());
                            item.put("price", equipment.getPrice());
                            item.put("category", equipment.getCategory().getName());
                            return item;
                        }
                )
                .toList();
    }

    //-----------------------------------------------TASK-----------------------------------------------//

    @Override
    public ResponseEntity<ResponseObject> getTaskList() {
        List<Map<String, Object>> data = taskRepo.findAll().stream()
                .map(
                        task -> {
                            Map<String, Object> dataItem = new HashMap<>();
                            dataItem.put("code", task.getCode());
                            dataItem.put("desc", task.getDescription());
                            dataItem.put("status", task.getStatus());
                            dataItem.put("assigned", task.getAssignedDate());
                            dataItem.put("staff", task.getUser().getName());
                            return dataItem;
                        }
                )
                .toList();

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(data)
                        .build()
        );
    }


    //-----------------------------------------------STAFF-----------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> getStaffList() {
        List<Map<String, Object>> data = accountRepo.findAll().stream()
                .filter(account -> account.getRole().equals(Role.STAFF))
                .map(
                        account -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("id", account.getUser().getId());
                            item.put("username", account.getUser().getName());
                            item.put("phone", account.getUser().getPhone());
                            item.put("status", account.getStatus());
                            return item;
                        }
                )
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
    public ResponseEntity<ResponseObject> assignStaff(AssignStaffRequest request) {
        String error = ManagerValidation.validateAssignStaff(request, userRepo, itemGroupRepo);

        if (!error.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data("")
                            .build()
                    );
        }

        User staff = userRepo.findById(request.getStaffId()).orElse(null);
        ItemGroup group = itemGroupRepo.findById(request.getGroupId()).orElse(null);
        assert staff != null;
        assert group != null;

        taskRepo.save(
                Task.builder()
                        .user(staff)
                        .itemGroup(group)
                        .code(generateTaskCode())
                        .description(request.getDescription())
                        .status(Status.TASK_ASSIGNED.getValue())
                        .assignedDate(request.getAssignDate())
                        .build()
        );
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseObject.builder()
                        .message("Assign staff successfully")
                        .success(true)
                        .data("")
                        .build()
                );
    }

    //-----------------------------------------------REQUEST-----------------------------------------------//

//    @Override
//    public ResponseEntity<ResponseObject> getAllRequestImport() {
//
//        List<Map<String, Object>> data = requestApplicationRepo.findAll().stream()
//                .filter(requestApplication -> "import".equals(requestApplication.getType()))
//                .map(
//                        requestImport -> {
//                            Map<String, Object> request = new HashMap<>();
//                            request.put("code", requestImport.getCode());
//                            request.put("requestDate", requestImport.getRequestDate());
//                            request.put("lastModifiedDate", requestImport.getLastModifiedDate());
//                            request.put("status", requestImport.getStatus());
//                            return request;
//                        }
//                ).toList();
//        if (!data.isEmpty()) {
//            return ResponseEntity.ok().body(
//                    ResponseObject
//                            .builder()
//                            .message("200 OK")
//                            .data(data)
//                            .build()
//            );
//        } else {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
//                    ResponseObject
//                            .builder()
//                            .message("204 No Content")
//                            .data("")
//                            .build()
//            );
//        }
//    }

//    @Override
//    public ResponseEntity<ResponseObject> getAllRequestExport() {
//        List<Map<String, Object>> data = requestApplicationRepo.findAll().stream()
//                .filter(requestApplication -> "export".equals(requestApplication.getType()))
//                .map(
//                        requestExport -> {
//                            Map<String, Object> request = new HashMap<>();
//                            request.put("code", requestExport.getCode());
//                            request.put("requestDate", requestExport.getRequestDate());
//                            request.put("lastModifiedDate", requestExport.getLastModifiedDate());
//                            request.put("status", requestExport.getStatus());
//                            return request;
//                        }
//                ).toList();
//        if (!data.isEmpty()) {
//            return ResponseEntity.ok().body(
//                    ResponseObject
//                            .builder()
//                            .message("200 OK")
//                            .data(data)
//                            .build()
//            );
//        } else {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
//                    ResponseObject
//                            .builder()
//                            .message("204 No Content")
//                            .data("")
//                            .build()
//            );
//        }
//    }

//    @Override
//    public ResponseEntity<ResponseObject> filterRequestByRequestDate(FilterRequestApplicationRequest request) {
//        List<Map<String, Object>> data = requestApplicationRepo.findAllByRequestDate(request.getRequestDate()).stream()
//                .map(
//                        requestApplication -> {
//                            Map<String, Object> requestfilter = new HashMap<>();
//                            requestfilter.put("code", requestApplication.getCode());
//                            requestfilter.put("requestDate", requestApplication.getRequestDate());
//                            requestfilter.put("lastModifiedDate", requestApplication.getLastModifiedDate());
//                            requestfilter.put("status", requestApplication.getStatus());
//                            return requestfilter;
//                        }
//                ).toList();
//        if (!data.isEmpty()) {
//            return ResponseEntity.ok().body(
//                    ResponseObject
//                            .builder()
//                            .message("200 OK")
//                            .data(data)
//                            .build()
//            );
//        } else {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
//                    ResponseObject
//                            .builder()
//                            .message("204 No Content")
//                            .data("")
//                            .build()
//            );
//        }
//    }

//    @Override
//    public ResponseEntity<ResponseObject> createImportRequest(CreateImportRequest request) {
//        RequestApplication requestApplication = RequestApplication
//                .builder()
//                .code(generateRequestCode())
//                .status(Status.REQUEST_PENDING.getValue())
//                .requestDate(LocalDate.now())
//                .lastModifiedDate(LocalDate.now())
//                .type(RequestType.IMPORT.getValue())
//                .build();
//
//        requestApplicationRepo.save(requestApplication);
//
//        List<CreateImportRequest.RequestItemList> sortedItems = new ArrayList<>(request.getRequestItemList());
//        sortedItems.sort(Comparator.comparingInt(CreateImportRequest.RequestItemList::getPartnerId));
//
//        List<ItemGroup> itemGroups = new ArrayList<>();
//        List<RequestItem> requestItems = new ArrayList<>();
//
//        int currentPartnerId = 0;
//        ItemGroup currentGroup = null;
//
//        List<RequestItem> itemsInCurrentGroup = new ArrayList<>();
//
//        for (CreateImportRequest.RequestItemList item : sortedItems) {
//            if (item.getPartnerId() != currentPartnerId) {
//                if (currentGroup != null) {
//                    currentGroup.setRequestItems(new ArrayList<>(itemsInCurrentGroup));
//                    itemGroups.add(currentGroup);
//                }
//
//                currentGroup = ItemGroup.builder()
//                        .requestApplication(requestApplication)
//                        .deliveryDate(null)
//                        .carrierName("")
//                        .carrierPhone("")
//                        .build();
//                currentGroup = itemGroupRepo.save(currentGroup);
//
//                currentPartnerId = item.getPartnerId();
//                itemsInCurrentGroup.clear();
//            }
//
//            RequestItem requestItem = RequestItem.builder()
//                    .quantity(item.getQuantity())
//                    .unitPrice(0)
//                    .equipment(equipmentRepo.findById(item.getEquipmentId()).orElse(null))
//                    .partner(partnerRepo.findById(item.getPartnerId()).orElse(null))
//                    .itemGroup(currentGroup)
//                    .build();
//
//            requestItems.add(requestItem);
//            itemsInCurrentGroup.add(requestItem);
//        }
//
//        if (currentGroup != null) {
//            currentGroup.setRequestItems(new ArrayList<>(itemsInCurrentGroup));
//            itemGroups.add(currentGroup);
//        }
//
//        requestItemRepo.saveAll(requestItems);
//        itemGroupRepo.saveAll(itemGroups);
//
//        requestApplication.setItemGroups(itemGroups);
//        requestApplicationRepo.save(requestApplication);
//
//        return ResponseEntity.ok().body(
//                ResponseObject
//                        .builder()
//                        .message("200 OK Created Application successfully")
//                        .build()
//        );
//    }


//    @Override
//    public ResponseEntity<ResponseObject> getRequestDetailByCode(GetRequestDetailRequest request) {
//        RequestApplication requestApplication = requestApplicationRepo.findAll().stream()
//                .filter(r -> r.getCode().equals(request.getCode())).findFirst().orElse(null);
//
//        if (requestApplication == null) {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
//                    ResponseObject.builder()
//                            .message("204 No Content")
//                            .data(null)
//                            .build()
//            );
//        }
//
//        Map<String, Object> requestDetail = new HashMap<>();
//        requestDetail.put("code", requestApplication.getCode());
//        requestDetail.put("requestDate", requestApplication.getRequestDate());
//        requestDetail.put("lastModified", requestApplication.getLastModifiedDate());
//        requestDetail.put("status", requestApplication.getStatus());
//
//        List<Map<String, Object>> itemGroupList = requestApplication.getItemGroups().stream()
//                .map(group -> {
//                    Map<String, Object> groupDetail = new HashMap<>();
//
//                    groupDetail.put("groupId", group.getId());
//                    groupDetail.put("deliveryDate", group.getDeliveryDate());
//                    groupDetail.put("carrierName", group.getCarrierName());
//                    groupDetail.put("carrierPhone", group.getCarrierPhone());
//
//                    List<Map<String, Object>> requestItemList = group.getRequestItems().stream()
//                            .map(
//                                    item -> {
//                                        Map<String, Object> itemDetail = new HashMap<>();
//                                        itemDetail.put("equipmentName", item.getEquipment().getName());
//                                        itemDetail.put("equipmentDescription", item.getEquipment().getDescription());
//                                        itemDetail.put("quantity", item.getQuantity());
//                                        itemDetail.put("unit", item.getEquipment().getUnit());
//
//
//                                        if (item.getPartner() != null) {
//                                            groupDetail.put("partner", item.getPartner().getUser().getName());
//                                        }
//                                        return itemDetail;
//                                    }).toList();
//                    groupDetail.put("requestItems", requestItemList);
//                    return groupDetail;
//                }).toList();
//
//        requestDetail.put("itemGroups", itemGroupList);
//        return ResponseEntity.ok().body(
//                ResponseObject.builder()
//                        .message("200 OK")
//                        .data(requestDetail)
//                        .build());
//    }

//    @Override
//    public ResponseEntity<ResponseObject> approveImportRequest(ApproveImportRequest request) {
//
//        RequestApplication requestApplication = requestApplicationRepo.findAll().stream()
//                .filter(r -> r.getCode().equals(request.getCode())).findFirst().orElse(null);
//
//        if (requestApplication == null) {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
//                    ResponseObject
//                            .builder()
//                            .message("204 No Content")
//                            .data("")
//                            .build()
//            );
//        }
//
//        if (requestApplication.getStatus().equalsIgnoreCase(Status.REQUEST_ACCEPTED.getValue())) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    ResponseObject
//                            .builder()
//                            .message("Request already accepted")
//                            .data("")
//                            .build()
//            );
//        }
//
//        if (requestApplication.getStatus().equalsIgnoreCase(Status.REQUEST_CANCELLED.getValue())) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    ResponseObject
//                            .builder()
//                            .message("You can not approve the cancelled request")
//                            .data("")
//                            .build()
//            );
//        }
//
//        requestApplication.setStatus(Status.REQUEST_ACCEPTED.getValue());
//        requestApplicationRepo.save(requestApplication);
//
//        Map<String, Object> requestApprove = new HashMap<>();
//        requestApprove.put("code", requestApplication.getCode());
//        requestApprove.put("status", requestApplication.getStatus());
//        requestApprove.put("message", "Request has been approved");
//
//        return ResponseEntity.ok().body(
//                ResponseObject
//                        .builder()
//                        .message("200 OK")
//                        .data(requestApprove)
//                        .build()
//        );
//    }

//    @Override
//    public ResponseEntity<ResponseObject> cancelImportRequest(CancelImportRequest request) {
//
//        RequestApplication requestApplication = requestApplicationRepo.findAll().stream()
//                .filter(r -> r.getCode().equals(request.getCode())).findFirst().orElse(null);
//
//
//        if (requestApplication == null) {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
//                    ResponseObject
//                            .builder()
//                            .message("204 No Content")
//                            .data("")
//                            .build()
//            );
//        }
//
//
//        if (requestApplication.getStatus().equalsIgnoreCase(Status.REQUEST_ACCEPTED.getValue())) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    ResponseObject
//                            .builder()
//                            .message("Can not cancel approved request ")
//                            .data("")
//                            .build()
//            );
//        }
//
//        if (requestApplication.getStatus().equalsIgnoreCase(Status.REQUEST_CANCELLED.getValue())) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    ResponseObject
//                            .builder()
//                            .message("Request already cancelled")
//                            .data("")
//                            .build()
//            );
//        }
//
//        if (requestApplication.getRequestDate().isBefore(LocalDate.now())) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                    ResponseObject
//                            .builder()
//                            .message("You can only cancel requests on the same day")
//                            .data("")
//                            .build()
//            );
//        }
//
//        requestApplication.setStatus(Status.REQUEST_CANCELLED.getValue());
//        requestApplicationRepo.save(requestApplication);
//
//        Map<String, Object> requestApprove = new HashMap<>();
//        requestApprove.put("code", requestApplication.getCode());
//        requestApprove.put("status", requestApplication.getStatus());
//        requestApprove.put("message", "Request has been cancel");
//
//        return ResponseEntity.ok().body(
//                ResponseObject
//                        .builder()
//                        .message("200 OK")
//                        .data(requestApprove)
//                        .build()
//        );
//    }

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

    //    @Override
//    public ResponseEntity<ResponseObject> updateImportRequest(UpdateImportRequest request) {
//
//        RequestApplication requestApplication = requestApplicationRepo.findById(request.getRequestAppId()).orElse(null);
//
//
//        if (requestApplication == null) {
//            return ResponseEntity.status(HttpStatus.NO_CONTENT)
//                    .body(ResponseObject.builder()
//                            .message("204 No Content - Request application not found")
//                            .build());
//        }
//
//        List<RequestItem> currentItems = requestApplication.getItems();
//        List<UpdateImportRequest.Items> updatedItems = request.getItems();
//        List<Integer> itemIdsInList = currentItems.stream().map(RequestItem::getId).toList();
//        int count = 0;
//
//        for (RequestItem item : currentItems) {
//             UpdateImportRequest.Items i = getItemById(item.getId(), updatedItems);
//             Equipment equipment;
//             Partner partner;
//             if(
//                     i != null
//                             && (equipment = equipmentRepo.findById(i.getEquipmentId()).orElse(null)) != null
//                             && (partner = partnerRepo.findById(i.getPartnerId()).orElse(null)) != null) {
//
//                 item.setEquipment(equipment);
//                 item.setPartner(partner);
//                 item.setQuantity(i.getQuantity());
//
//                 requestItemRepo.save(item);
//                 count++;
//             }
//        }
//        if(count == 0){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ResponseObject.builder()
//                            .message("400 bad request - No items updated")
//                            .build());
//        }
//
//
//        for(UpdateImportRequest.Items item : updatedItems) {
//
//            Equipment newEquipment = equipmentRepo.findById(item.getEquipmentId()).orElse(null);
//            Partner newPartner = partnerRepo.findById(item.getPartnerId()).orElse(null);
//
//            if (newEquipment == null || newPartner == null) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                        .body(ResponseObject.builder()
//                                .message("400 Bad Request - Equipment or Partner not found")
//                                .build());
//            }
//
//            for(RequestItem itemPresent : currentItems) {
//                if(itemIdsInList.contains(item.getRequestItemId())){
//                    if(item.getRequestItemId() == itemPresent.getId()){
//                        itemPresent.setEquipment(newEquipment);
//                        itemPresent.setPartner(newPartner);
//                        itemPresent.setQuantity(item.getQuantity());
//                    }
//                }
//                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
//                        ResponseObject.builder()
//                                .message("204 No Content - Dont have request item with id: " + item.getRequestItemId())
//                                .build()
//                );
//            }
//        }

//        requestApplication.setItems(currentItems);
//        requestApplicationRepo.save(requestApplication);
//
//        return ResponseEntity.ok().body(
//                ResponseObject
//                        .builder()
//                        .message("200 OK update application successfully")
//                        .build()
//        );
//    }

    //-----------------------------ITEM GROUP-----------------------------//

    @Override
    public ResponseEntity<ResponseObject> getAllUnassignedGroup() {
        List<Map<String, Object>> data = itemGroupRepo.findAll().stream()
                .filter(itemGroup -> !checkIfGroupAssigned(itemGroup.getId()))
                .map(itemGroup -> {
                    //request application detail
                    Map<String, Object> requestDetail = getRequestFromGroup(itemGroup);

                    //item
                    List<Map<String, Object>> itemList = getItemsFromGroup(itemGroup.getId());

                    //data item
                    Map<String, Object> dataItem = new HashMap<>();
                    dataItem.put("id", itemGroup.getId());
                    dataItem.put("cName", itemGroup.getCarrierName());
                    dataItem.put("cPhone", itemGroup.getCarrierPhone());
                    dataItem.put("delivery", itemGroup.getDeliveryDate());
                    dataItem.put("status", itemGroup.getStatus());
                    dataItem.put("partner", getPartnerFromGroup(itemGroup).getUser().getName());
                    dataItem.put("request", requestDetail);
                    dataItem.put("items", itemList);
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

    private UpdateImportRequest.Items getItemById(int id, List<UpdateImportRequest.Items> items) {
        return items.stream().filter(item -> item.getRequestItemId() == id).findFirst().orElse(null);
    }

    private boolean checkIfGroupAssigned(int groupId) {
        return taskRepo.findAll().stream()
                .filter(task -> task.getItemGroup().getId().equals(groupId))
                .findFirst()
                .orElse(null) != null;
    }

    private List<Map<String, Object>> getItemsFromGroup(int groupId) {
        return requestItemRepo.findAll().stream()
                .filter(item -> item.getItemGroup().getId() == groupId)
                .map(item -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", item.getId());
                    map.put("equipment", item.getEquipment().getName());
                    map.put("quantity", item.getQuantity());
                    map.put("price", item.getUnitPrice());
                    map.put("length", item.getLength());
                    map.put("width", item.getWidth());
                    map.put("category", item.getEquipment().getCategory().getName());
                    map.put("unit", item.getEquipment().getUnit());
                    return map;
                })
                .toList();
    }

    private Map<String, Object> getRequestFromGroup(ItemGroup group){
        Map<String, Object> request = new HashMap<>();
        request.put("code", group.getRequestApplication().getCode());
        request.put("requestDate", group.getRequestApplication().getRequestDate());
        request.put("lastModified", group.getRequestApplication().getLastModifiedDate());
        request.put("type", group.getRequestApplication().getType());
        return request;
    }

    private Partner getPartnerFromGroup(ItemGroup group) {
        return group.getRequestItems().get(0).getPartner();
    }

    private String generateTaskCode() {
        List<Task> tasks = taskRepo.findAll();
        int latestCode = Integer.parseInt(tasks.get(tasks.size() - 1).getCode().split(CodeFormat.TASK.getValue())[1]);
        return CodeFormat.TASK.getValue() + (latestCode + 1);
    }
}
