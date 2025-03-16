package com.medic115.mwms_be.services;

import com.medic115.mwms_be.requests.AssignBatchRequest;
import com.medic115.mwms_be.response.BatchItemResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface BatchService {
    List<BatchItemResponse> getAllBatchItems(Integer batchId);

    void deleteBatch(Integer batchId);

    ResponseEntity<?> assignBatchToPosition(AssignBatchRequest request);

}
