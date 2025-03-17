package com.medic115.mwms_be.services;

import com.medic115.mwms_be.requests.CreateBatchRequest;
import com.medic115.mwms_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface StaffService {

    //-------------------------------------------TASK-------------------------------------------//
    ResponseEntity<ResponseObject> getTaskList(int id);

    //-------------------------------------------AREA-------------------------------------------//
    ResponseEntity<ResponseObject> getAreaList();

    //-------------------------------------------BATCH-------------------------------------------//

    ResponseEntity<ResponseObject> createBatch(CreateBatchRequest request);
}
