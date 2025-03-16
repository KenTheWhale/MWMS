package com.medic115.mwms_be.services;

import com.medic115.mwms_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface StaffService {

    //-------------------------------------------TASK-------------------------------------------//
    ResponseEntity<ResponseObject> getTaskList(int id);
}
