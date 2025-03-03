package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.ChangeWarehouseRequestStatusRequest;
import com.medic115.mwms_be.dto.requests.GetWarehouseRequest;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.services.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

//    @PostMapping("/request/list")
//    public ResponseEntity<ResponseObject> getRequestList(@RequestBody GetWarehouseRequest request) {
//        return supplierService.getRequestList(request);
//    }
//
//    @PutMapping("/request/status")
//    public ResponseEntity<ResponseObject> changeRequestStatus(@RequestBody ChangeWarehouseRequestStatusRequest request) {
//        return supplierService.changeRequestStatus(request);
//    }

}
