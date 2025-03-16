package com.medic115.mwms_be.controllers;


import com.medic115.mwms_be.requests.AddCategoryRequest;
import com.medic115.mwms_be.requests.AddEquipmentRequest;
import com.medic115.mwms_be.requests.AddForUpdateRequest;
import com.medic115.mwms_be.requests.AreaRequest;
import com.medic115.mwms_be.requests.CancelImportRequest;
import com.medic115.mwms_be.requests.CreateImportRequest;
import com.medic115.mwms_be.requests.CreateTaskRequest;
import com.medic115.mwms_be.requests.DeleteCategoryRequest;
import com.medic115.mwms_be.requests.DeleteEquipmentRequest;
import com.medic115.mwms_be.requests.FilterRequestApplicationRequest;
import com.medic115.mwms_be.requests.GetRequestDetailRequest;
import com.medic115.mwms_be.requests.GetTaskByCodeRequest;
import com.medic115.mwms_be.requests.PositionRequest;
import com.medic115.mwms_be.requests.UpdateCategoryRequest;
import com.medic115.mwms_be.requests.UpdateEquipmentRequest;
import com.medic115.mwms_be.requests.UpdateImportRequest;
import com.medic115.mwms_be.requests.ViewEquipmentSupplierRequest;
import com.medic115.mwms_be.requests.ViewSupplierEquipmentRequest;
import com.medic115.mwms_be.response.AreaResponse;
import com.medic115.mwms_be.response.BatchItemResponse;
import com.medic115.mwms_be.response.PositionResponse;
import com.medic115.mwms_be.response.ResponseObject;
import com.medic115.mwms_be.services.AreaService;
import com.medic115.mwms_be.services.BatchService;
import com.medic115.mwms_be.services.ManagerService;
import com.medic115.mwms_be.services.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    private final AreaService areaService;

    private final PositionService positionService;

    private final BatchService batchService;

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

    //-------------------------------------------------Equipment-------------------------------------------------//

    @GetMapping("/equipment")
    @PreAuthorize("hasAnyRole('manager', 'admin')")
    public ResponseEntity<ResponseObject> viewEquipment() {
        return managerService.viewEquipment();
    }

    @PostMapping("/supplier/equipment")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> viewEquipmentSupplier(@RequestBody ViewEquipmentSupplierRequest request) {
        return managerService.viewEquipmentSupplier(request);
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

    @DeleteMapping("/equipment/{code}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> deleteEquipment(@PathVariable String code) {
        return managerService.deleteEquipment(code);
    }

    //-------------------------------------------------Staff-------------------------------------------------//

    @GetMapping("/staff/list")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getStaffs(){
        return managerService.getStaffs();
    }

    //-------------------------------------------------Task-------------------------------------------------//

    @GetMapping("/task/list")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getTaskList(){
        return managerService.getTaskList();
    }

    @PostMapping("/task/detail")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getTaskByCode(@RequestBody GetTaskByCodeRequest request){
        return managerService.getTaskByCode(request);
    }

    @DeleteMapping("/task/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> deleteTask(@PathVariable int id){
        return managerService.deleteTask(id);
    }

    @PostMapping("/task")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> createTask(@RequestBody CreateTaskRequest request){
        return managerService.createTask(request);
    }

    //-------------------------------------------------Item Group-------------------------------------------------//

    @GetMapping("/group/unassign")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getUnassignedGroups(){
        return managerService.getUnassignedGroups();
    }

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
//
//    @PutMapping("/request/approve")
//    @PreAuthorize("hasRole('manager')")
//    public ResponseEntity<ResponseObject> approveImportRequest(@RequestBody ApproveImportRequest request) {
//        return managerService.approveImportRequest(request);
//    }
//
    @PostMapping("/request/import")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> createImportRequest(@RequestBody CreateImportRequest request) {
        return managerService.createImportRequest(request);
    }

    @PutMapping("/request/import")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> updateImportRequest(@RequestBody UpdateImportRequest request) {
        return managerService.updateImportRequest(request);
    }

    @PostMapping("/request/detail/import")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> addImportRequest(@RequestBody AddForUpdateRequest request) {
        return managerService.addForUpdateRequest(request);
    }

    @PutMapping("/request/requestItem")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> cancelRequest(@RequestBody CancelImportRequest request) {
        return managerService.cancelImportRequest(request);
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
    public ResponseEntity<?> createArea(@RequestBody AreaRequest areaRequest) {
        return areaService.createArea(areaRequest);
    }

    @PutMapping("/area/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<?> updateArea(@PathVariable Integer id, @RequestBody AreaRequest areaRequest) {
        return areaService.updateArea(id, areaRequest);
    }

    @PatchMapping("/area/delete/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<?> deleteArea(@PathVariable("id") Integer id) {
        return areaService.deleteArea(id);
    }

    @PatchMapping("/area/restore/{id}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<?> restoreArea(@PathVariable("id") Integer id) {
        return areaService.restoreArea(id);
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
    public ResponseEntity<?> createPosition(@RequestBody PositionRequest positionRequest) {
        return positionService.createPosition(positionRequest);
    }

    @PutMapping("/position/{positionId}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<?> updatePosition(@PathVariable("positionId") Integer positionId, @RequestBody PositionRequest positionRequest) {
        return positionService.updatePosition(positionId, positionRequest);
    }

    @DeleteMapping("/position/{positionId}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<String> deletePosition(@PathVariable("positionId") Integer positionId) {
        positionService.deletePosition(positionId);
        return ResponseEntity.ok("Delete position successful");
    }


    //------------------------------------------BatchItem----------------------------------------------//

    @GetMapping("/batch-item/{batchId}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<List<BatchItemResponse>> getAlBatchItems(@PathVariable("batchId") Integer batchId) {
        return ResponseEntity.ok(batchService.getAllBatchItems(batchId));
    }
    //-----------------------------------------------------
    @GetMapping("/supplier")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<ResponseObject> getListSupplier() {
        return managerService.getListSupplier();
    }

    @DeleteMapping("/batch/{batchId}")
    @PreAuthorize("hasRole('manager')")
    public ResponseEntity<String> deleteBatch(@PathVariable("batchId") Integer batchId) {
        batchService.deleteBatch(batchId);
        return ResponseEntity.ok("Delete batch successful");
    }
}
