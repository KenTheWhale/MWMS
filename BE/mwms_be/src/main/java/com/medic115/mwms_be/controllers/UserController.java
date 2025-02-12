package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.response.UserResponse;
import com.medic115.mwms_be.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/test")
    @PreAuthorize("hasAuthority('admin:read')")
    public String helloAdmin(){
        return "Hello Admin";
    }
}
