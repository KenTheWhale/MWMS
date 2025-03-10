package com.medic115.mwms_be.implementors;

import com.medic115.mwms_be.dto.requests.ChangeWarehouseRequestStatusRequest;
import com.medic115.mwms_be.dto.requests.GetWarehouseRequest;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.Type;
import com.medic115.mwms_be.models.ItemGroup;
import com.medic115.mwms_be.models.Partner;
import com.medic115.mwms_be.models.RequestApplication;
import com.medic115.mwms_be.repositories.ItemGroupRepo;
import com.medic115.mwms_be.repositories.PartnerRepo;
import com.medic115.mwms_be.repositories.RequestApplicationRepo;
import com.medic115.mwms_be.services.SupplierService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierServiceImpl implements SupplierService {

    RequestApplicationRepo requestApplicationRepo;
    private final PartnerRepo partnerRepo;
    private final ItemGroupRepo itemGroupRepo;

    @Override
    public ResponseEntity<ResponseObject> getRequestList(GetWarehouseRequest warehouseRequest) {
        List<Map<String, Object>> data = itemGroupRepo.findAll().stream()
                .filter(itemGroup -> checkItemGroupCondition(itemGroup, warehouseRequest.getUsername()))
                .map(itemGroup -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", itemGroup.getId());
                    map.put("code", itemGroup.getRequestApplication().getCode());
                    map.put("status", itemGroup.getStatus());
                    map.put("requestDate", itemGroup.getRequestApplication().getRequestDate());
                    map.put("lastModifiedDate", itemGroup.getRequestApplication().getLastModifiedDate());
                    map.put("deliveryDate", itemGroup.getDeliveryDate());
                    map.put("carrierName", itemGroup.getCarrierName());
                    map.put("carrierPhone", itemGroup.getCarrierPhone());
                    map.put("rejectionReason", itemGroup.getRejectionReason());
                    map.put("requestItems", getItemsFromGroup(itemGroup));
                    return map;
                })
                .toList();

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Get request list success")
                .data(data)
                .build());
    }

    private boolean checkItemGroupCondition(ItemGroup itemGroup, String partnerName) {
        return !itemGroup.getRequestItems().isEmpty()
                && itemGroup.getRequestItems().get(0).getPartner().getUser().getName().equalsIgnoreCase(partnerName);
    }

    private List<Map<String, Object>> getItemsFromGroup(ItemGroup itemGroup) {
        return itemGroup.getRequestItems().stream()
                .map(item -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", item.getId());
                    map.put("quantity", item.getQuantity());
                    map.put("equipmentName", item.getEquipment().getName());
                    map.put("length", item.getLength());
                    map.put("width", item.getWidth());
                    return map;
                })
                .toList();
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

            if (hasMatchingSupplier) {
                itemGroup.setStatus(request.getStatus());

                if (Status.REQUEST_ACCEPTED.getValue().equals(request.getStatus())) {
                    itemGroup.setDeliveryDate(request.getDeliveryDate());
                    itemGroup.setCarrierName(request.getCarrierName());
                    itemGroup.setCarrierPhone(request.getCarrierPhone());
                } else {
                    itemGroup.setRejectionReason(request.getRejectionReason());
                }
            }
        }
        requestApplicationRepo.save(requestApplication);

        if (Status.REQUEST_ACCEPTED.getValue().equals(request.getStatus())) {
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Request is accepted")
                    .build());
        } else {
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Request is rejected")
                    .build());
        }
    }
}
