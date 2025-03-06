package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.EditAccountRequest;
import com.medic115.mwms_be.dto.requests.RefreshTokenRequest;
import com.medic115.mwms_be.dto.requests.SignInRequest;
import com.medic115.mwms_be.dto.requests.SignUpRequest;
import com.medic115.mwms_be.dto.response.JwtAuthenticationResponse;
import org.springframework.http.ResponseEntity;

public interface AuthenticationService {

    ResponseEntity<JwtAuthenticationResponse> signIn(SignInRequest request);

    ResponseEntity<JwtAuthenticationResponse> refreshToken(RefreshTokenRequest request);

    ResponseEntity<String> signUp(SignUpRequest request);

    ResponseEntity<String> deleteUser(Integer id);

    ResponseEntity<String> activateUser(Integer id);

    ResponseEntity<String> updateUser(Integer id, EditAccountRequest request);

}
