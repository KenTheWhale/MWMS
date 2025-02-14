package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.ApproveImportRequest;
import com.medic115.mwms_be.dto.requests.CancelImportRequest;
import com.medic115.mwms_be.dto.requests.FilterRequestApplicationRequest;
import com.medic115.mwms_be.dto.requests.GetRequestDetailRequest;
import com.medic115.mwms_be.dto.requests.AddCategoryRequest;
import com.medic115.mwms_be.dto.requests.DeleteCategoryRequest;
import com.medic115.mwms_be.dto.requests.UpdateCategoryRequest;
import com.medic115.mwms_be.dto.response.AddCategoryResponse;
import com.medic115.mwms_be.dto.response.ViewCategoryResponse;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.services.ManagerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/category")
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<ResponseObject> viewCategory() {
        return managerService.viewCategory();
    }

    @PostMapping("/category")
    @PreAuthorize("hasAuthority('manager:create')")
    public ResponseEntity<ResponseObject> addCategory(@RequestBody AddCategoryRequest request) {
        return managerService.addCategory(request);
    }

    @PutMapping("/category")
    @PreAuthorize("hasAuthority('manager:update')")
    public ResponseEntity<ResponseObject> updateCategory(@RequestBody UpdateCategoryRequest request) {
        return managerService.updateCategory(request);
    }

    @DeleteMapping("/category")
    @PreAuthorize("hasAuthority('manager:delete')")
    public ResponseEntity<ResponseObject> deleteCategory(@RequestBody DeleteCategoryRequest request) {
        return managerService.deleteCategory(request);
    }

    @GetMapping("/staff/list")
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<ResponseObject> getStaffList() {
        return managerService.getStaffList();
    }

    @GetMapping("/request/import")
    public ResponseEntity<ResponseObject> getAllRequestImport() {
        return managerService.getAllRequestImport();
    }

    @GetMapping("/request/export")
    public ResponseEntity<ResponseObject> getAllRequestExport() {
        return managerService.getAllRequestExport();
    }

    @PostMapping("/request/filter")
    public ResponseEntity<ResponseObject> getAllRequestFilter(@RequestBody FilterRequestApplicationRequest request) {
        return managerService.filterRequestByRequestDate(request);
    }

    @PostMapping("/request/detail")
    public ResponseEntity<ResponseObject> getRequestDetail(@RequestBody GetRequestDetailRequest request) {
        return managerService.getRequestDetailByCode(request);
    }

    @PutMapping("/request/approve")
    public ResponseEntity<ResponseObject> approveImportRequest(@RequestBody ApproveImportRequest request) {
        return managerService.approveImportRequest(request);
    }

    @PutMapping("/request/cancel")
    public ResponseEntity<ResponseObject> cancelImportRequest(@RequestBody CancelImportRequest request) {
        return managerService.cancelImportRequest(request);
    }


}
