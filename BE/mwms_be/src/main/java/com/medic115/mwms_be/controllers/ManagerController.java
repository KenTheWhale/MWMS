package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.AddCategoryRequest;
import com.medic115.mwms_be.dto.response.AddCategoryResponse;
import com.medic115.mwms_be.dto.response.ViewCategoryResponse;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.services.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/category")
    @PreAuthorize("hasAuthority('manager:read')")
    public ViewCategoryResponse viewCategory() {
        return managerService.viewCategory();
    }

    @PostMapping("/category")
    @PreAuthorize("hasAuthority('manager:create')")
    public AddCategoryResponse addCategory(@RequestBody AddCategoryRequest request) {
        return managerService.addCategory(request);
    }

    @GetMapping("/staff/list")
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<ResponseObject> getStaffList() {
        return managerService.getStaffList();
    }

}
