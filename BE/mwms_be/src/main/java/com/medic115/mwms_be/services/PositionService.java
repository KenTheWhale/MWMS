package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.PositionRequest;
import com.medic115.mwms_be.dto.response.PositionResponse;

import java.util.List;

public interface PositionService {

    void createPosition(PositionRequest request);

    List<PositionResponse> getAllPosition(Integer areaId);

    PositionResponse getPosition(Integer id);

    PositionResponse updatePosition(Integer id, PositionRequest request);
    
}
