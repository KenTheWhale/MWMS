package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.ApproveWarehouseRequest;
import com.medic115.mwms_be.dto.requests.GetWarehouseRequest;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.models.ItemGroup;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierServiceImpl implements SupplierService {

    PartnerRepo partnerRepo;

    RequestApplicationRepo requestApplicationRepo;

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
                    map.put("status", request.getStatus());
                    map.put("requestDate", request.getRequestDate());
                    map.put("lastModifiedDate", request.getLastModifiedDate());

                    LocalDate earliestDeliveryDate = request.getItemGroups().stream()
                            .map(ItemGroup::getDeliveryDate)
                            .filter(Objects::nonNull)
                            .min(LocalDate::compareTo)
                            .orElse(null);
                    map.put("deliveryDate", earliestDeliveryDate);
                    return map;
                }).toList();
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Get request list success")
                .data(data)
                .build());
    }

    @Override
    public ResponseEntity<ResponseObject> approveRequest(ApproveWarehouseRequest request) {
//        RequestApplication requestApplication = requestApplicationRepo.findByCode(request.getCode());
        return null;
    }
}
