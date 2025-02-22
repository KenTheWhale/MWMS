package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.*;
import com.medic115.mwms_be.dto.response.AddCategoryResponse;
import com.medic115.mwms_be.dto.response.ViewCategoryResponse;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.services.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    //-------------------------------------------------Category-------------------------------------------------//

    @GetMapping("/category")
    @PreAuthorize("hasRole('manager')")
    public ViewCategoryResponse viewCategory() {
        return managerService.viewCategory();
    }

    @PostMapping("/category")
    @PreAuthorize("hasRole('manager')")
    public AddCategoryResponse addCategory(@RequestBody AddCategoryRequest request) {
        return managerService.addCategory(request);
    }

    //-------------------------------------------------Staff-------------------------------------------------//

    @GetMapping("/staff/list")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getStaffList() {
        return managerService.getStaffList();
    }

    //-------------------------------------------------Task-------------------------------------------------//


    //-------------------------------------------------Request-------------------------------------------------//

    @GetMapping("/request/import")
    @PreAuthorize("hasRole('manager')")

    public ResponseEntity<ResponseObject> getAllRequestImport() {
        return managerService.getAllRequestImport();
    }

    @GetMapping("/request/export")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getAllRequestExport() {
        return managerService.getAllRequestExport();
    }

    @PostMapping("/request/filter")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getAllRequestFilter(@RequestBody FilterRequestApplicationRequest request) {
        return managerService.filterRequestByRequestDate(request);
    }

    @PostMapping("/request/detail")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getRequestDetail(@RequestBody GetRequestDetailRequest request) {
        return managerService.getRequestDetailByCode(request);
    }

    @PutMapping("/request/approve")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> approveImportRequest(@RequestBody ApproveImportRequest request) {
        return managerService.approveImportRequest(request);
    }

    @PutMapping("/request/cancel")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> cancelImportRequest(@RequestBody CancelImportRequest request) {
        return managerService.cancelImportRequest(request);
    }

    @PostMapping("/request/create")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> createImportRequest(@RequestBody CreateImportRequest request) {
        return managerService.createImportRequest(request);
    }


}
