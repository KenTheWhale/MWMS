package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface ManagerService {

    ResponseEntity<ResponseObject> getStaffList();
}
