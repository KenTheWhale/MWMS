package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.GetWarehouseRequest;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.services.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping("/request/list")
    public ResponseEntity<ResponseObject> getRequestList(GetWarehouseRequest request) {
        return supplierService.getRequestList(request);
    }

}
