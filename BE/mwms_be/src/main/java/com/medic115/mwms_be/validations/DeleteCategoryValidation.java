package com.medic115.mwms_be.validations;

import com.medic115.mwms_be.requests.DeleteCategoryRequest;
import com.medic115.mwms_be.models.Category;
import com.medic115.mwms_be.repositories.CategoryRepo;

public class DeleteCategoryValidation {
    public static String validate(String code, CategoryRepo categoryRepo) {
        String error = null;
        Category category = categoryRepo.findByCode(code);
        if (category == null) {
            error = "Category name has already deleted";
        } else if (!category.getEquipments().isEmpty()) {
            error = "This category is being belonged to some equipments";
        }
        return error;
    }
}