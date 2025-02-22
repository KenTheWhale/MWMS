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
    public ResponseEntity<ResponseObject> viewCategory() {
        return managerService.viewCategory();
    }

    @PostMapping("/category")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> addCategory(@RequestBody AddCategoryRequest request) {
        return managerService.addCategory(request);
    }

    @PutMapping("/category")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> updateCategory(@RequestBody UpdateCategoryRequest request) {
        return managerService.updateCategory(request);
    }

    @DeleteMapping("/category")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> deleteCategory(@RequestBody DeleteCategoryRequest request) {
        return managerService.deleteCategory(request);
    }

    //-------------------------------------------------Staff-------------------------------------------------//

    @GetMapping("/equipment")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> viewEquipment() {
        return managerService.viewEquipment();
    }

    @PostMapping("/equipment")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> addEquipment(@RequestBody AddEquipmentRequest request) {
        return managerService.addEquipment(request);
    }

    @PutMapping("/equipment")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> updateEquipment(@RequestBody UpdateEquipmentRequest request) {
        return managerService.updateEquipment(request);
    }

    @DeleteMapping("/equipment")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> deleteEquipment(@RequestBody DeleteEquipmentRequest request) {
        return managerService.deleteEquipment(request);
    }

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