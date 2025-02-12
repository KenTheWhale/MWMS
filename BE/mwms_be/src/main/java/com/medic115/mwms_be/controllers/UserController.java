package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.RefreshTokenRequest;
import com.medic115.mwms_be.dto.response.JwtAuthenticationResponse;
import com.medic115.mwms_be.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthenticationService authenticationService;

    @GetMapping("/test")
    @PreAuthorize("hasAuthority('admin:read')")
    public String helloAdmin(){
        return "Hello Admin";
    }

    @PostMapping("/refresh")
    @PreAuthorize(
            "hasAuthority('admin:read')" +
                    "|| hasAuthority('manager:read')" +
                    "|| hasAuthority('staff:read')" +
                    "|| hasAuthority('partner:read')")
    ResponseEntity<JwtAuthenticationResponse> refreshToken(@RequestBody RefreshTokenRequest request){
        return authenticationService.refreshToken(request);
    }
}
