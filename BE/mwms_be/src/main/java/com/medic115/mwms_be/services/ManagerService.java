package com.medic115.mwms_be.services;

import com.medic115.mwms_be.requests.AddCategoryRequest;
import com.medic115.mwms_be.requests.AddEquipmentRequest;
import com.medic115.mwms_be.requests.AddForUpdateRequest;
import com.medic115.mwms_be.requests.CancelImportRequest;
import com.medic115.mwms_be.requests.CreateImportRequest;
import com.medic115.mwms_be.requests.CreateTaskRequest;
import com.medic115.mwms_be.requests.DeleteCategoryRequest;
import com.medic115.mwms_be.requests.DeleteEquipmentRequest;
import com.medic115.mwms_be.requests.FilterRequestApplicationRequest;
import com.medic115.mwms_be.requests.GetRequestDetailRequest;
import com.medic115.mwms_be.requests.GetTaskByCodeRequest;
import com.medic115.mwms_be.requests.UpdateCategoryRequest;
import com.medic115.mwms_be.requests.UpdateEquipmentRequest;
import com.medic115.mwms_be.requests.UpdateImportRequest;
import com.medic115.mwms_be.requests.ViewEquipmentSupplierRequest;
import com.medic115.mwms_be.requests.ViewSupplierEquipmentRequest;
import com.medic115.mwms_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface ManagerService {

    //----------------------------Staff----------------------------//

    ResponseEntity<ResponseObject> getStaffs();

    //----------------------------Task----------------------------//

    ResponseEntity<ResponseObject> getTaskList();

    ResponseEntity<ResponseObject> deleteTask(int id);

    ResponseEntity<ResponseObject> createTask(CreateTaskRequest request);

  ResponseEntity<ResponseObject> getTaskByCode(GetTaskByCodeRequest request);

    //----------------------------Item Group----------------------------//

    ResponseEntity<ResponseObject> getUnassignedGroups();

    //----------------------------Request----------------------------//

  ResponseEntity<ResponseObject> getAllRequestImport();

    ResponseEntity<ResponseObject> getAllRequestExport();

    ResponseEntity<ResponseObject> filterRequestByRequestDate(FilterRequestApplicationRequest request);

    ResponseEntity<ResponseObject> createImportRequest(CreateImportRequest request);

    ResponseEntity<ResponseObject> getRequestDetailByCode(GetRequestDetailRequest request);

//    ResponseEntity<ResponseObject> approveImportRequest(ApproveImportRequest request);

    ResponseEntity<ResponseObject> cancelImportRequest(CancelImportRequest request);

  ResponseEntity<ResponseObject> updateImportRequest(UpdateImportRequest request);

  ResponseEntity<ResponseObject> addForUpdateRequest(AddForUpdateRequest request);

    //----------------------------Supplier----------------------------//

    ResponseEntity<ResponseObject> getListSupplier();

    //----------------------------Category----------------------------//
    ResponseEntity<ResponseObject> viewCategory();

    ResponseEntity<ResponseObject> addCategory(AddCategoryRequest request);

    ResponseEntity<ResponseObject> updateCategory(UpdateCategoryRequest request);

    ResponseEntity<ResponseObject> deleteCategory(DeleteCategoryRequest request);

    //----------------------------Equipment----------------------------//
    ResponseEntity<ResponseObject> viewEquipment();

    ResponseEntity<ResponseObject> viewEquipmentSupplier(ViewEquipmentSupplierRequest request);

    ResponseEntity<ResponseObject> viewSupplierEquipment(ViewSupplierEquipmentRequest request);

    ResponseEntity<ResponseObject> addEquipment(AddEquipmentRequest request);

    ResponseEntity<ResponseObject> updateEquipment(UpdateEquipmentRequest request);

    ResponseEntity<ResponseObject> deleteEquipment(DeleteEquipmentRequest request);



}