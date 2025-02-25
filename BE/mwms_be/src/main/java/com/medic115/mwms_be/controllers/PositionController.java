package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.PositionRequest;
import com.medic115.mwms_be.dto.response.PositionResponse;
import com.medic115.mwms_be.services.PositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/position")
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<List<PositionResponse>> getAllPositions() {
        List<PositionResponse> responses = positionService.getAllPosition();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{positionId}")
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<PositionResponse> getPositionById(@PathVariable("positionId") Integer positionId) {
        PositionResponse response = positionService.getPosition(positionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('manager:create')")
    public ResponseEntity<String> createPosition(@RequestBody PositionRequest positionRequest) {
        positionService.createPosition(positionRequest);
        return ResponseEntity.ok("Create position successful");
    }

    @PutMapping("/{positionId}")
    @PreAuthorize("hasAuthority('manager:update')")
    public ResponseEntity<String> updatePosition(@PathVariable("positionId") Integer positionId, @RequestBody PositionRequest positionRequest) {
        positionService.updatePosition(positionId, positionRequest);
        return ResponseEntity.ok("Update position successful");
    }
}
