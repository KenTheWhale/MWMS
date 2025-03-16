package com.medic115.mwms_be.services;

import com.medic115.mwms_be.requests.EditAccountRequest;
import com.medic115.mwms_be.requests.SignInRequest;
import com.medic115.mwms_be.requests.SignUpRequest;
import com.medic115.mwms_be.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;

public interface AuthenticationService {

    ResponseEntity<ResponseObject> login(SignInRequest request, HttpServletResponse response);

    ResponseEntity<ResponseObject> logout(HttpServletRequest request, HttpServletResponse response);

    ResponseEntity<ResponseObject> refresh(HttpServletRequest request, HttpServletResponse response);

    ResponseEntity<String> signUp(SignUpRequest request) throws BadRequestException;

    ResponseEntity<String> deleteUser(Integer id);

    ResponseEntity<String> activateUser(Integer id);

    ResponseEntity<String> updateUser(Integer id, EditAccountRequest request);

}
