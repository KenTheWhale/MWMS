package com.medic115.mwms_be.controllers;


import com.medic115.mwms_be.dto.requests.SignInRequest;
import com.medic115.mwms_be.dto.requests.SignUpRequest;
import com.medic115.mwms_be.dto.response.JwtAuthenticationResponse;
import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.services.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<ResponseObject> signIn(@RequestBody SignInRequest request, HttpServletResponse response) {
        return authenticationService.login(request, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseObject> logout(HttpServletRequest request, HttpServletResponse response) {
        return authenticationService.logout(request, response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ResponseObject> refresh(HttpServletRequest request, HttpServletResponse response) {
        return authenticationService.refresh(request, response);
    }


}
