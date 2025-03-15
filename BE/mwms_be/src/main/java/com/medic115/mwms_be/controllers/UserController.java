package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.requests.EditAccountRequest;
import com.medic115.mwms_be.requests.SignUpRequest;
import com.medic115.mwms_be.response.AccountResponse;
import com.medic115.mwms_be.services.AuthenticationService;
import com.medic115.mwms_be.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final AuthenticationService authenticationService;

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<AccountResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllAccountExceptAdmin());
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest request) throws BadRequestException {
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

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<String> updateAccount(@PathVariable Integer userId,@RequestBody EditAccountRequest request) {
        return authenticationService.updateUser(userId, request);
    }
}