package com.medic115.mwms_be.validations;

import com.medic115.mwms_be.requests.AddCategoryRequest;
import com.medic115.mwms_be.repositories.CategoryRepo;

public class CategoryValidation {
    public static String validateCategory(AddCategoryRequest request, CategoryRepo categoryRepo) {
        String error = null;
        if (request.getName() == null || request.getName().isEmpty()) {
            error = "Category name is required";
        } else if (request.getCode() == null || request.getCode().isEmpty()) {
            error = "Category code is required";
        } else if (request.getName().length() < 3) {
            error = "Category name must be at least 3 characters";
        } else if (request.getName().length() > 20) {
            error = "Category name must be at most 50 characters";
        } else if (request.getDescription().length() > 100) {
            error = "Category description must be at most 100 characters";
        } else if (categoryRepo.findByName(request.getName()) != null) {
            error = "Category name already exists";
        } else if (categoryRepo.findByCode(request.getCode()) != null) {
            error = "Category code already exists";
        }
        return error;
    }
}
