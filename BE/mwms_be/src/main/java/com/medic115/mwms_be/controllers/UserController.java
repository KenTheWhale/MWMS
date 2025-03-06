package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.RefreshTokenRequest;
import com.medic115.mwms_be.dto.requests.SignUpRequest;
import com.medic115.mwms_be.dto.response.AccountResponse;
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

    private final AuthenticationService authenticationService;

    private final UserService userService;


    @PostMapping("/refresh")
    @PreAuthorize("hasRole('admin') || hasRole('manager') || hasRole('staff') || hasRole('partner')")
    ResponseEntity<JwtAuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        return authenticationService.refreshToken(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<AccountResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllAccountExceptAdmin());
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest request) {
        return authenticationService.signUp(request);
    }

    @PatchMapping("/delete/{userId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer userId) {
        return authenticationService.deleteUser(userId);
    }

    @PatchMapping("/activate/{userId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<String> activateUser(@PathVariable Integer userId) {
        return authenticationService.activateUser(userId);
    }
}