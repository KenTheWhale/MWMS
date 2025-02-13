package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.AddCategoryRequest;
import com.medic115.mwms_be.dto.response.AddCategoryResponse;
import com.medic115.mwms_be.dto.response.ViewCategoryResponse;
import com.medic115.mwms_be.services.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/manager")
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/category")
    public ViewCategoryResponse viewCategory() {
        return managerService.viewCategory();
    }

    @PostMapping("/category")
    public AddCategoryResponse addCategory(@RequestBody AddCategoryRequest request) {
        return managerService.addCategory(request);
    }

}
