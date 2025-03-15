package com.medic115.mwms_be.services;

import com.medic115.mwms_be.response.BatchItemResponse;

import java.util.List;

public interface BatchService {
    List<BatchItemResponse> getAllBatchItems(Integer batchId);

    void deleteBatch(Integer batchId);
}
