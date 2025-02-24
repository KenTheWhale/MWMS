package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.dto.requests.AreaRequest;
import com.medic115.mwms_be.dto.response.AreaResponse;
import com.medic115.mwms_be.services.AreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/area")
public class AreaController {
    private final AreaService areaService;

    @GetMapping
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<List<AreaResponse>> getAllAreas() {
        List<AreaResponse> response = areaService.getAllAreas();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<AreaResponse> getAreaById(@PathVariable Integer id) {
        AreaResponse response = areaService.getAreaById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('manager:create')")
    public ResponseEntity<String> createArea(@RequestBody AreaRequest areaRequest) {
        areaService.createArea(areaRequest);
        return ResponseEntity.ok("created successfully !");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('manager:update')")
    public ResponseEntity<AreaResponse> updateArea(@PathVariable Integer id, @RequestBody AreaRequest areaRequest) {
        AreaResponse response = areaService.updateArea(id, areaRequest);
        return ResponseEntity.ok(response);
    }
}
