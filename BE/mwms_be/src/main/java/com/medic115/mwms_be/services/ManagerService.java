package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.*;
import com.medic115.mwms_be.dto.requests.AddCategoryRequest;
import com.medic115.mwms_be.dto.requests.UpdateCategoryRequest;
import com.medic115.mwms_be.dto.response.AddCategoryResponse;
import com.medic115.mwms_be.dto.response.DeleteCategoryResponse;
import com.medic115.mwms_be.dto.response.UpdateCategoryResponse;
import com.medic115.mwms_be.dto.response.ViewCategoryResponse;
import com.medic115.mwms_be.dto.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface ManagerService {

    //----------------------------Staff----------------------------//

//    ResponseEntity<ResponseObject> getStaffList();

    //----------------------------Request----------------------------//

//    ResponseEntity<ResponseObject> getAllRequests();
//
//    ResponseEntity<ResponseObject> getAllRequestImport();
//
//    ResponseEntity<ResponseObject> getAllRequestExport();
//
//    ResponseEntity<ResponseObject> filterRequestByRequestDate(FilterRequestApplicationRequest request);
//
//    ResponseEntity<ResponseObject> createImportRequest(CreateImportRequest request);
//
//    ResponseEntity<ResponseObject> getRequestDetailByCode(GetRequestDetailRequest request);

    ResponseEntity<ResponseObject> approveImportRequest(ApproveImportRequest request);

    ResponseEntity<ResponseObject> cancelImportRequest(CancelImportRequest request);

//    ResponseEntity<ResponseObject> updateImportRequest(UpdateImportRequest request);

    //----------------------------Category----------------------------//
    ViewCategoryResponse viewCategory();

    AddCategoryResponse addCategory(AddCategoryRequest request);

    UpdateCategoryResponse updateCategory(UpdateCategoryRequest request);

    DeleteCategoryResponse deleteCategory(int id);

    //----------------------------Task----------------------------//

//    ResponseEntity<ResponseObject> getTaskList();
}