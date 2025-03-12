package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.requests.PositionRequest;
import com.medic115.mwms_be.dto.response.PositionResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PositionService {

    ResponseEntity<?> createPosition(PositionRequest request);

    List<PositionResponse> getAllPosition(Integer areaId);

    PositionResponse getPosition(Integer id);

    ResponseEntity<?> updatePosition(Integer id, PositionRequest request);

    void deletePosition(Integer id);
}
