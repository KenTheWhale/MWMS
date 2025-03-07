package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.RefreshTokenRequest;
import com.medic115.mwms_be.dto.response.JwtAuthenticationResponse;
import com.medic115.mwms_be.dto.response.UserResponse;
import com.medic115.mwms_be.services.AuthenticationService;
import com.medic115.mwms_be.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllAccountExceptAdmin());
    }
}