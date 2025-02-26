package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.*;
import com.medic115.mwms_be.dto.response.AreaResponse;
import com.medic115.mwms_be.dto.response.PositionResponse;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.services.AreaService;
import com.medic115.mwms_be.services.ManagerService;
import com.medic115.mwms_be.services.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    private final AreaService areaService;

    private final PositionService positionService;

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

    @PostMapping("/category/search")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> searchCategory(@RequestBody SearchRequest request) {
        return managerService.searchCategory(request);
    }

    //-------------------------------------------------Equipment-------------------------------------------------//

    @GetMapping("/equipment")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> viewEquipment() {
        return managerService.viewEquipment();
    }

    @PostMapping("/equipment/supplier")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> viewSupplierEquipment(@RequestBody ViewSupplierEquipmentRequest request) {
        return managerService.viewSupplierEquipment(request);
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

    @PostMapping("/equipment/search")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> searchEquipment(@RequestBody SearchRequest request) {
        return managerService.searchEquipment(request);
    }

    //-------------------------------------------------Staff-------------------------------------------------//

    @PostMapping("/staff/assign")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> assignStaff(@RequestBody AssignStaffRequest request) {
        return managerService.assignStaff(request);
    }

    //-------------------------------------------------Task-------------------------------------------------//

    @GetMapping("/task/list")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getTaskList() {
        return managerService.getTaskList();
    }

    //-------------------------------------------------Request-------------------------------------------------//
//
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

    @PostMapping("/request/import")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> createImportRequest(@RequestBody CreateImportRequest request) {
        return managerService.createImportRequest(request);
    }
//
//    @PutMapping("/request/import")
//    @PreAuthorize("hasRole('manager')")
//    public ResponseEntity<ResponseObject> updateImportRequest(@RequestBody UpdateImportRequest request) {
//        return managerService.updateImportRequest(request);
//    }

    //-------------------------------------------------Request-------------------------------------------------//

    @GetMapping("/item/group/unassigned")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getAllUnassignedGroup() {
        return managerService.getAllUnassignedGroup();
    }


    //-------------------------------------------------Area-----------------------------------------------------//
    @GetMapping("/area")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<List<AreaResponse>> getAllAreas() {
        List<AreaResponse> response = areaService.getAllAreas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/area/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<AreaResponse> getAreaById(@PathVariable Integer id) {
        AreaResponse response = areaService.getAreaById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/area")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<String> createArea(@RequestBody AreaRequest areaRequest) {
        areaService.createArea(areaRequest);
        return ResponseEntity.ok("created successfully !");
    }

    @PutMapping("/area/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<AreaResponse> updateArea(@PathVariable Integer id, @RequestBody AreaRequest areaRequest) {
        AreaResponse response = areaService.updateArea(id, areaRequest);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/area/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<AreaResponse> deleteArea(@PathVariable("id") Integer id, @RequestParam String status) {
        AreaResponse response = areaService.deleteArea(id, status);
        return ResponseEntity.ok(response);
    }

    //----------------------------------------------------------Position------------------------------------------//
    @GetMapping("/position/{areaId}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<List<PositionResponse>> getAllPositions(@PathVariable("areaId") Integer areaId) {
        List<PositionResponse> responses = positionService.getAllPosition(areaId);
        return ResponseEntity.ok(responses);
    }


    @GetMapping("/position/individual/{positionId}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<PositionResponse> getPositionById(@PathVariable("positionId") Integer positionId) {
        PositionResponse response = positionService.getPosition(positionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/position")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<String> createPosition(@RequestBody PositionRequest positionRequest) {
        positionService.createPosition(positionRequest);
        return ResponseEntity.ok("Create position successful");
    }

    @PutMapping("/position/{positionId}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<String> updatePosition(@PathVariable("positionId") Integer positionId, @RequestBody PositionRequest positionRequest) {
        positionService.updatePosition(positionId, positionRequest);
        return ResponseEntity.ok("Update position successful");
    }

    @GetMapping("/supplier")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getListSupplier() {
        return managerService.getListSupplier();
    }
}
