package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.response.ResponseObject;
import com.medic115.mwms_be.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    //-------------------------------------------TASK-------------------------------------------//
    @GetMapping("/task/{id}")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<ResponseObject> getTaskList(@PathVariable int id) {
        return staffService.getTaskList(id);
    }
}
