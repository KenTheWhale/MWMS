package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.AddCategoryRequest;
import com.medic115.mwms_be.dto.requests.UpdateCategoryRequest;
import com.medic115.mwms_be.dto.response.AddCategoryResponse;
import com.medic115.mwms_be.dto.response.DeleteCategoryResponse;
import com.medic115.mwms_be.dto.response.UpdateCategoryResponse;
import com.medic115.mwms_be.dto.response.ViewCategoryResponse;
import com.medic115.mwms_be.models.Category;
import com.medic115.mwms_be.repositories.CategoryRepo;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.repositories.AccountRepo;
import com.medic115.mwms_be.services.ManagerService;
import com.medic115.mwms_be.validations.CategoryValidation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ManagerServiceImpl implements ManagerService {

    private final AccountRepo accountRepo;

    CategoryRepo categoryRepo;

    @Override
    public ViewCategoryResponse viewCategory() {
        List<Category> categories = categoryRepo.findAll();
        return ViewCategoryResponse.builder()
                .status("200")
                .message("Categories retrieved successfully")
                .categorieList(categories.stream()
                        .map(cate -> ViewCategoryResponse.Cate.builder()
                                .id(cate.getId())
                                .code(cate.getCode())
                                .name(cate.getName())
                                .description(cate.getDescription())
                                .build())
                        .toList())
                .build();
    }

    @Override
    public AddCategoryResponse addCategory(AddCategoryRequest request) {
        String error = CategoryValidation.validateCategory(request, categoryRepo);
        if (error != null) {
            return AddCategoryResponse.builder()
                    .status("400")
                    .message(error)
                    .build();
        }
        categoryRepo.save(
                Category.builder()
                        .code(request.getCode())
                        .name(request.getName())
                        .description(request.getDescription())
                        .build()
        );
        return AddCategoryResponse.builder()
                .status("400")
                .message("Category added successfully")
                .build();
    }

    @Override
    public UpdateCategoryResponse updateCategory(UpdateCategoryRequest request) {
        return null;
    }

    @Override
    public DeleteCategoryResponse deleteCategory(int id) {
        return null;
    }

    @Override
    public ResponseEntity<ResponseObject> getStaffList() {
        List<Map<String, Object>> data = accountRepo.findAllByRole(Role.STAFF).stream()
                .map(
                        account -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("username", account.getUsername());
                            item.put("phone", account.getPhone());
                            item.put("status", account.getStatus());
                            return item;
                        }
                )
                .toList();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .data(data)
                        .build()
        );
    }

}
