package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.GetWarehouseRequest;
import com.medic115.mwms_be.dto.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface RequesterService {

    ResponseEntity<ResponseObject> getRequestList(GetWarehouseRequest request);
}
