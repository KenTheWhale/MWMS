package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.RefreshTokenRequest;
import com.medic115.mwms_be.dto.requests.SignInRequest;
import com.medic115.mwms_be.dto.response.JwtAuthenticationResponse;
import org.springframework.http.ResponseEntity;

public interface AuthenticationService {

    ResponseEntity<JwtAuthenticationResponse> signIn(SignInRequest request);

    ResponseEntity<JwtAuthenticationResponse> refreshToken(RefreshTokenRequest request);

}
