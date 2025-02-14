package com.medic115.mwms_be.validations;

import com.medic115.mwms_be.dto.requests.DeleteCategoryRequest;
import com.medic115.mwms_be.models.Category;
import com.medic115.mwms_be.repositories.CategoryRepo;

public class DeleteCategoryValidation {
    public static String validate(DeleteCategoryRequest request, CategoryRepo categoryRepo) {
        String error = null;
        Category category = categoryRepo.findById(request.getCateId()).orElse(null);
        if (request.getCateId() <= 0) {
            error = "Category ID must be greater than 0";
        } else if (category == null) {
            error = "Category name has already deleted";
        } else if (!category.getEquipments().isEmpty()) {
            error = "This category is being belonged to some equipments";
        }
        return error;
    }
}