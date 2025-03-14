package com.medic115.mwms_be.validations;

import com.medic115.mwms_be.requests.UpdateCategoryRequest;
import com.medic115.mwms_be.repositories.CategoryRepo;

public class UpdateCategoryValidation {
    public static String validate(UpdateCategoryRequest request, CategoryRepo categoryRepo) {
        String error = null;
        if (request.getName().isEmpty()) {
            error = "Name is required";
        }
        return error;
    }
}