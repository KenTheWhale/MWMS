package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.*;
import com.medic115.mwms_be.dto.response.*;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.models.*;
import com.medic115.mwms_be.repositories.*;
import com.medic115.mwms_be.services.ManagerService;
import com.medic115.mwms_be.validations.CategoryValidation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManagerServiceImpl implements ManagerService {

    private final AccountRepo accountRepo;

    private final RequestApplicationRepo requestApplicationRepo;

    private final TaskRepo taskRepo;

    private final EquipmentRepo equipmentRepo;

    private final RequestItemRepo requestItemRepo;

    private final BatchRepo batchRepo;

    private final CategoryRepo categoryRepo;

    private final PartnerRepo partnerRepo;

    //-----------------------------------------------CATEGORY-----------------------------------------------//
    @Override
    public ViewCategoryResponse viewCategory() {
        List<Category> categories = categoryRepo.findAll();
        return ViewCategoryResponse.builder()
                .status("200")
                .message("Categories retrieved successfully")
                .categorieList(categories.stream()
                        .map(cate -> ViewCategoryResponse.Cate.builder()
                                .id(cate.getId())
                                .code(cate.getCode())
                                .name(cate.getName())
                                .description(cate.getDescription())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public AddCategoryResponse addCategory(AddCategoryRequest request) {
        String error = CategoryValidation.validateCategory(request, categoryRepo);
        if (error != null) {
            return AddCategoryResponse.builder()
                    .status("400")
                    .message(error)
                    .build();
        }
        categoryRepo.save(
                Category.builder()
                        .code(request.getCode())
                        .name(request.getName())
                        .description(request.getDescription())
                        .build()
        );
        return AddCategoryResponse.builder()
                .status("400")
                .message("Category added successfully")
                .build();
    }

    @Override
    public UpdateCategoryResponse updateCategory(UpdateCategoryRequest request) {
        return null;
    }

    @Override
    public DeleteCategoryResponse deleteCategory(int id) {
        return null;
    }


    //-----------------------------------------------STAFF-----------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> getStaffList() {
        List<Map<String, Object>> data = accountRepo.findAll().stream()
                .filter(account -> account.getRole().equals(Role.STAFF))
                .map(
                        account -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("username", account.getUsername());
                            item.put("phone", account.getPhone());
                            item.put("status", account.getStatus());
                            return item;
                        }
                )
                .toList();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .data(data)
                        .build()
        );
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
                            request.put("deliveryDate", requestImport.getDeliveryDate());
                            request.put("lastModifiedDate", requestImport.getLastModifiedDate());
                            request.put("status", requestImport.getStatus());
                            return request;
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject
                            .builder()
                            .message("204 No Content")
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
                            request.put("deliveryDate", requestExport.getDeliveryDate());
                            request.put("lastModifiedDate", requestExport.getLastModifiedDate());
                            request.put("status", requestExport.getStatus());
                            return request;
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject
                            .builder()
                            .message("204 No Content")
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
                            requestfilter.put("deliveryDate", requestApplication.getDeliveryDate());
                            requestfilter.put("lastModifiedDate", requestApplication.getLastModifiedDate());
                            requestfilter.put("status", requestApplication.getStatus());
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
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
        String newCode = generateRequestCode();

        RequestApplication requestApplication = RequestApplication
                .builder()
                .code(newCode)
                .requestDate(LocalDate.now())
                .deliveryDate(null)
                .lastModifiedDate(LocalDate.now())
                .task(null)
                .type("import")
                .status(Status.REQUEST_PENDING.getValue())
                .build();

        requestApplicationRepo.save(requestApplication);

        for (CreateImportRequest.RequestItemList item : request.getRequestItemList()) {
            Equipment equipment = equipmentRepo.findById(item.getEquipmentId()).orElse(null);
            Partner partner = partnerRepo.findById(item.getPartnerId()).orElse(null);

            if (equipment == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ResponseObject.builder()
                                .message("404 Equipment Not Found")
                                .data(null)
                                .build()
                );
            }

            if (partner == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ResponseObject.builder()
                                .message("404 Partner Not Found")
                                .data(null)
                                .build()
                );
            }

            RequestItem requestItem = RequestItem
                    .builder()
                    .equipment(equipment)
                    .partner(partner)
                    .requestApplication(requestApplication)
                    .quantity(item.getQuantity())
                    .carrierName("")
                    .carrierPhone("")
                    .unitPrice(0)
                    .build();

            requestItemRepo.save(requestItem);
        }

        Map<String, Object> requestApplicationMap = new HashMap<>();
        requestApplicationMap.put("code", newCode);
        requestApplicationMap.put("requestDate", LocalDate.now());
        requestApplicationMap.put("deliveryDate", null);
        requestApplicationMap.put("lastModifiedDate", LocalDate.now());
        requestApplicationMap.put("status", Status.REQUEST_PENDING.getValue());
        requestApplicationMap.put("task", null);
        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("200 OK request create success")
                        .data(requestApplicationMap)
                        .build()
        );
    }


    @Override
    public ResponseEntity<ResponseObject> getRequestDetailByCode(GetRequestDetailRequest request) {
        RequestApplication requestApplication = requestApplicationRepo.getRequestApplicationByCode(request.getCode());

        if (requestApplication == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("204 No Content")
                            .data(null)
                            .build()
            );
        }

        Map<String, Object> requestDetail = new HashMap<>();
        requestDetail.put("code", requestApplication.getCode());
        requestDetail.put("requestDate", requestApplication.getRequestDate());
        requestDetail.put("deliveryDate", requestApplication.getDeliveryDate());
        requestDetail.put("status", requestApplication.getStatus());


        List<Map<String, Object>> items = requestApplication.getItems().stream()
                .map(
                        item -> {
                            Map<String, Object> itemMap = new HashMap<>();
                            itemMap.put("name", item.getEquipment().getName());
                            itemMap.put("description", item.getEquipment().getDescription());
                            itemMap.put("quantity", item.getQuantity());
                            itemMap.put("partner", item.getPartner().getName());
                            return itemMap;
                        }
                ).toList();

        requestDetail.put("items", items);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("200 OK")
                        .data(requestDetail)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> approveImportRequest(ApproveImportRequest request) {

        RequestApplication requestApplication = requestApplicationRepo.getRequestApplicationByCode(request.getCode());

        if (requestApplication == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject
                            .builder()
                            .message("204 No Content")
                            .data("")
                            .build()
            );
        }

        if (requestApplication.getStatus().equalsIgnoreCase(Status.REQUEST_ACCEPTED.getValue())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject
                            .builder()
                            .message("Request already accepted")
                            .data("")
                            .build()
            );
        }

        if (requestApplication.getStatus().equalsIgnoreCase(Status.REQUEST_CANCELLED.getValue())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject
                            .builder()
                            .message("You can not approve the cancelled request")
                            .data("")
                            .build()
            );
        }

        requestApplication.setStatus(Status.REQUEST_ACCEPTED.getValue());
        requestApplicationRepo.save(requestApplication);

        Map<String, Object> requestApprove = new HashMap<>();
        requestApprove.put("code", requestApplication.getCode());
        requestApprove.put("status", requestApplication.getStatus());
        requestApprove.put("message", "Request has been approved");

        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("200 OK")
                        .data(requestApprove)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> cancelImportRequest(CancelImportRequest request) {

        RequestApplication requestApplication = requestApplicationRepo.getRequestApplicationByCode(request.getCode());


        if (requestApplication == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject
                            .builder()
                            .message("204 No Content")
                            .data("")
                            .build()
            );
        }


        if (requestApplication.getStatus().equalsIgnoreCase(Status.REQUEST_ACCEPTED.getValue())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject
                            .builder()
                            .message("Can not cancel approved request ")
                            .data("")
                            .build()
            );
        }

        if (requestApplication.getStatus().equalsIgnoreCase(Status.REQUEST_CANCELLED.getValue())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject
                            .builder()
                            .message("Request already cancelled")
                            .data("")
                            .build()
            );
        }

        if (requestApplication.getRequestDate().isBefore(LocalDate.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject
                            .builder()
                            .message("You can only cancel requests on the same day")
                            .data("")
                            .build()
            );
        }

        requestApplication.setStatus(Status.REQUEST_CANCELLED.getValue());
        requestApplicationRepo.save(requestApplication);

        Map<String, Object> requestApprove = new HashMap<>();
        requestApprove.put("code", requestApplication.getCode());
        requestApprove.put("status", requestApplication.getStatus());
        requestApprove.put("message", "Request has been cancel");

        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("200 OK")
                        .data(requestApprove)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> updateImportRequest(UpdateImportRequest request) {

        RequestApplication requestApplication = requestApplicationRepo.findById(request.getRequestAppId()).orElse(null);


        if (requestApplication == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(ResponseObject.builder()
                            .message("204 No Content - Request application not found")
                            .build());
        }

        List<RequestItem> currentItems = requestApplication.getItems();
        List<UpdateImportRequest.Items> updatedItems = request.getItems();
        List<Integer> itemIdsInList = currentItems.stream().map(RequestItem::getId).toList();
        int count = 0;

        for (RequestItem item : currentItems) {
             UpdateImportRequest.Items i = getItemById(item.getId(), updatedItems);
             Equipment equipment;
             Partner partner;
             if(
                     i != null
                             && (equipment = equipmentRepo.findById(i.getEquipmentId()).orElse(null)) != null
                             && (partner = partnerRepo.findById(i.getPartnerId()).orElse(null)) != null) {

                 item.setEquipment(equipment);
                 item.setPartner(partner);
                 item.setQuantity(i.getQuantity());

                 requestItemRepo.save(item);
                 count++;
             }
        }
        if(count == 0){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseObject.builder()
                            .message("400 bad request - No items updated")
                            .build());
        }


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
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
//                        ResponseObject.builder()
//                                .message("204 No Content - Dont have request item with id: " + item.getRequestItemId())
//                                .build()
//                );
//            }
//        }

//        requestApplication.setItems(currentItems);
//        requestApplicationRepo.save(requestApplication);

        return ResponseEntity.ok().body(
                ResponseObject
                        .builder()
                        .message("200 OK update application successfully")
                        .build()
        );
    }


    //-----------------------------PRIVATE FUNCTION-----------------------------//
    private String generateRequestCode() {
        RequestApplication lastRequest = requestApplicationRepo.findTopByOrderByIdDesc();

        if (lastRequest == null) {
            return "REQ1";
        }
        String lastCode = lastRequest.getCode();
        int lastNumber = Integer.parseInt(lastCode.replace("REQ", ""));
        return "REQ" + (lastNumber + 1);
    }

    private UpdateImportRequest.Items getItemById(int id, List<UpdateImportRequest.Items> items) {
        return items.stream().filter(item -> item.getRequestItemId() == id).findFirst().orElse(null);
    }
}
