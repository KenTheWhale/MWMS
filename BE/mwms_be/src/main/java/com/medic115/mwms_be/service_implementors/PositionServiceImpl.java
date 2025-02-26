package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.PositionRequest;
import com.medic115.mwms_be.dto.response.BatchResponse;
import com.medic115.mwms_be.dto.response.PositionResponse;
import com.medic115.mwms_be.models.Area;
import com.medic115.mwms_be.models.Batch;
import com.medic115.mwms_be.models.Position;
import com.medic115.mwms_be.repositories.AreaRepo;
import com.medic115.mwms_be.repositories.PositionRepo;
import com.medic115.mwms_be.services.PositionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {

    private final PositionRepo positionRepo;

    private final AreaRepo areaRepo;

    @Override
    public void createPosition(PositionRequest request) {
        if(request == null || request.areaId() == null){
            throw new IllegalArgumentException("request and id cannot be null");
        }

        Area area = areaRepo.findById(request.areaId()).orElseThrow(() -> new EntityNotFoundException("Area not found"));

        Position position = Position.builder()
                .name(request.name())
                .area(area)
                .build();

        positionRepo.save(position);
    }

    @Override
    public List<PositionResponse> getAllPosition(Integer areaId) {
        Area area = areaRepo.findById(areaId).orElseThrow(() -> new EntityNotFoundException("Area not found"));
        List<PositionResponse> response = area.getPositions().stream().map(this::mapPositionToDto1).toList();

        return response != null ? response : Collections.emptyList();
    }

    @Override
    public PositionResponse getPosition(Integer id) {
        if(id == null){
            throw new IllegalArgumentException("id cannot be null");
        }

        Position position = positionRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Position not found"));
        return mapPositionToDto2(position);
    }

    @Override
    public PositionResponse updatePosition(Integer id, PositionRequest request) {
        if(id == null || request == null){
            throw new IllegalArgumentException("id and request cannot be null");
        }

        Position position = positionRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Position not found"));
        position.setName(request.name());

        Area area = areaRepo.findById(request.areaId()).orElseThrow(() -> new EntityNotFoundException("Area not found"));
        position.setArea(area);

        return mapPositionToDto2(positionRepo.save(position));
    }

    private PositionResponse mapPositionToDto1(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .name(position.getName())
                .build();
    }

    private PositionResponse mapPositionToDto2(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .name(position.getName())
                .batches(position.getBatches().stream().map(this::mapBatchToDto).collect(Collectors.toList()))
                .build();
    }

    private BatchResponse mapBatchToDto(Batch batch) {
        return BatchResponse.builder()
                .id(batch.getId())
                .code(batch.getCode())
                .equipmentQty(batch.getEquipmentQty())
                .createdDate(batch.getCreatedDate())
                .build();
    }
}
