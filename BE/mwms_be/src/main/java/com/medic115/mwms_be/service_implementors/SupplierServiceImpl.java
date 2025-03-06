package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.ChangeWarehouseRequestStatusRequest;
import com.medic115.mwms_be.dto.requests.GetWarehouseRequest;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.models.ItemGroup;
import com.medic115.mwms_be.models.Partner;
import com.medic115.mwms_be.models.RequestApplication;
import com.medic115.mwms_be.repositories.PartnerRepo;
import com.medic115.mwms_be.repositories.RequestApplicationRepo;
import com.medic115.mwms_be.services.SupplierService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierServiceImpl implements SupplierService {

    RequestApplicationRepo requestApplicationRepo;
    private final PartnerRepo partnerRepo;

    @Override
    public ResponseEntity<ResponseObject> getRequestList(GetWarehouseRequest warehouseRequest) {
        List<Map<String, Object>> data = requestApplicationRepo.findAll().stream()
                .filter(request -> "import".equalsIgnoreCase(request.getType())
                                && request.getItemGroups() != null
                                && request.getItemGroups().stream().anyMatch(itemGroup ->
                                itemGroup.getRequestItems() != null &&
                                        itemGroup.getRequestItems().stream().anyMatch(requestItem ->
                                                requestItem.getPartner() != null &&
                                                        requestItem.getPartner().getUser().getName().equals(warehouseRequest.getUsername())
                                        )
                        )
                )
                .map(request -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", request.getId());
                    map.put("code", request.getCode());

                    List<String> statuses = request.getItemGroups().stream()
                            .map(ItemGroup::getStatus)
                            .filter(Objects::nonNull)
                            .distinct()
                            .toList();
                    map.put("status", statuses.size() == 1 ? statuses.get(0) : statuses);

                    map.put("requestDate", request.getRequestDate());
                    map.put("lastModifiedDate", request.getLastModifiedDate());

                    LocalDate earliestDeliveryDate = request.getItemGroups().stream()
                            .map(ItemGroup::getDeliveryDate)
                            .filter(Objects::nonNull)
                            .min(LocalDate::compareTo)
                            .orElse(null);
                    map.put("deliveryDate", earliestDeliveryDate);

                    List<Map<String, Object>> requestItems = request.getItemGroups().stream()
                            .flatMap(itemGroup -> itemGroup.getRequestItems().stream())
                            .filter(requestItem -> requestItem.getPartner() != null &&
                                    requestItem.getPartner().getUser().getName().equals(warehouseRequest.getUsername()))
                            .map(requestItem -> {
                                Map<String, Object> itemMap = new HashMap<>();
                                itemMap.put("id", requestItem.getId());
                                itemMap.put("quantity", requestItem.getQuantity());
                                itemMap.put("unitPrice", requestItem.getUnitPrice());

                                if (requestItem.getEquipment() != null) {
                                    itemMap.put("equipmentName", requestItem.getEquipment().getName());
                                }

                                itemMap.put("length", requestItem.getLength());
                                itemMap.put("width", requestItem.getWidth());

                                return itemMap;
                            })
                            .toList();

                    map.put("requestItems", requestItems);

                    return map;
                }).toList();

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Get request list success")
                .data(data)
                .build());
    }


    @Override
    public ResponseEntity<ResponseObject> changeRequestStatus(ChangeWarehouseRequestStatusRequest request) {
        RequestApplication requestApplication = requestApplicationRepo.findByCode(request.getCode());

        if (requestApplication.getItemGroups().stream()
                .allMatch(itemGroup -> Status.REQUEST_CANCELLED.getValue().equals(itemGroup.getStatus()))) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message("Can not change status of a cancelled request")
                    .build());
        }

        Partner supplier = partnerRepo.findByUser_Name(request.getUsername()).orElse(null);
        if (supplier == null) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message("Supplier not found")
                    .build());
        }

        for (ItemGroup itemGroup : requestApplication.getItemGroups()) {
            boolean hasMatchingSupplier = itemGroup.getRequestItems().stream()
                    .anyMatch(requestItem -> requestItem.getPartner().getUser().getName() != null
                            && requestItem.getPartner().getUser().getName().equals(supplier.getUser().getName()));

            if (hasMatchingSupplier && Status.REQUEST_ACCEPTED.getValue().equals(itemGroup.getStatus())) {
                itemGroup.setStatus(request.getStatus());
                itemGroup.setDeliveryDate(request.getDeliveryDate());
                itemGroup.setCarrierName(request.getCarrierName());
                itemGroup.setCarrierPhone(request.getCarrierPhone());
                requestApplication.setLastModifiedDate(LocalDate.now());
            } else {
                itemGroup.setStatus(request.getStatus());
            }
        }
        requestApplicationRepo.save(requestApplication);

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Request status updated successfully")
                .data(null)
                .build());
    }
}
