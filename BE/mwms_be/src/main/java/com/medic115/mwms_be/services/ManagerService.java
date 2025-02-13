package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.AddCategoryRequest;
import com.medic115.mwms_be.dto.requests.UpdateCategoryRequest;
import com.medic115.mwms_be.dto.response.AddCategoryResponse;
import com.medic115.mwms_be.dto.response.DeleteCategoryResponse;
import com.medic115.mwms_be.dto.response.UpdateCategoryResponse;
import com.medic115.mwms_be.dto.response.ViewCategoryResponse;
import com.medic115.mwms_be.dto.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface ManagerService {

    ResponseEntity<ResponseObject> getStaffList();

    ViewCategoryResponse viewCategory();

    AddCategoryResponse addCategory(AddCategoryRequest request);

    UpdateCategoryResponse updateCategory(UpdateCategoryRequest request);

    DeleteCategoryResponse deleteCategory(int id);

}
