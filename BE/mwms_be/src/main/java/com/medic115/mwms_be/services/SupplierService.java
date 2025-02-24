package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.ApproveWarehouseRequest;
import com.medic115.mwms_be.dto.requests.GetWarehouseRequest;
import com.medic115.mwms_be.dto.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface SupplierService {

    ResponseEntity<ResponseObject> getRequestList(GetWarehouseRequest request);

    ResponseEntity<ResponseObject> approveRequest(ApproveWarehouseRequest request);

}
