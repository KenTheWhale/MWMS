package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.*;
import com.medic115.mwms_be.dto.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface ManagerService {

    //----------------------------Staff----------------------------//

//    ResponseEntity<ResponseObject> getStaffList();


    //----------------------------Request----------------------------//
//
    ResponseEntity<ResponseObject> getAllRequestImport();

    ResponseEntity<ResponseObject> getAllRequestExport();
//
    ResponseEntity<ResponseObject> filterRequestByRequestDate(FilterRequestApplicationRequest request);
//
//    ResponseEntity<ResponseObject> createImportRequest(CreateImportRequest request);
//
    ResponseEntity<ResponseObject> getRequestDetailByCode(GetRequestDetailRequest request);

    ResponseEntity<ResponseObject> approveImportRequest(ApproveImportRequest request);

    ResponseEntity<ResponseObject> cancelImportRequest(CancelImportRequest request);

//    ResponseEntity<ResponseObject> updateImportRequest(UpdateImportRequest request);

    //----------------------------Category----------------------------//
    ResponseEntity<ResponseObject> viewCategory();

    ResponseEntity<ResponseObject> addCategory(AddCategoryRequest request);

    ResponseEntity<ResponseObject> updateCategory(UpdateCategoryRequest request);

    ResponseEntity<ResponseObject> deleteCategory(DeleteCategoryRequest request);

    ResponseEntity<ResponseObject> viewEquipment();

    ResponseEntity<ResponseObject> addEquipment(AddEquipmentRequest request);

    ResponseEntity<ResponseObject> updateEquipment(UpdateEquipmentRequest request);

    ResponseEntity<ResponseObject> deleteEquipment(DeleteEquipmentRequest request);

    //----------------------------Task----------------------------//

    ResponseEntity<ResponseObject> getTaskList();

    //----------------------------Item Group----------------------------//

    ResponseEntity<ResponseObject> getAllUnassignedGroup();
}