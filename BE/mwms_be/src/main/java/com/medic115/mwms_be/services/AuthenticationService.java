package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.RefreshTokenRequest;
import com.medic115.mwms_be.dto.requests.SignInRequest;
import com.medic115.mwms_be.dto.requests.SignUpRequest;
import com.medic115.mwms_be.dto.response.JwtAuthenticationResponse;
import com.medic115.mwms_be.dto.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface AuthenticationService {

    ResponseEntity<ResponseObject> login(SignInRequest request, HttpServletResponse response);

    ResponseEntity<ResponseObject> logout(HttpServletRequest request, HttpServletResponse response);

    ResponseEntity<ResponseObject> refresh(HttpServletRequest request, HttpServletResponse response);

    ResponseEntity<String> signUp(SignUpRequest request);
}
