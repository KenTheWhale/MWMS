package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.PositionRequest;
import com.medic115.mwms_be.dto.response.PositionResponse;
import com.medic115.mwms_be.models.Area;
import com.medic115.mwms_be.models.Position;
import com.medic115.mwms_be.repositories.AreaRepo;
import com.medic115.mwms_be.repositories.PositionRepo;
import com.medic115.mwms_be.services.PositionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {

    private final PositionRepo positionRepo;

    private final AreaRepo areaRepo;

    @Override
    public void createPosition(Integer areaId, PositionRequest request) {
        if(request == null || areaId == null){
            throw new IllegalArgumentException("request and id cannot be null");
        }

        Area area = areaRepo.findById(areaId).orElseThrow(() -> new EntityNotFoundException("Area not found"));

        Position position = Position.builder()
                .name(request.name())
                .area(area)
                .build();

        positionRepo.save(position);
    }

    @Override
    public List<PositionResponse> getAllPosition() {
        return positionRepo.findAll().stream().map(this::mapToDto).toList();
    }

    @Override
    public PositionResponse getPosition(Integer id) {
        if(id == null){
            throw new IllegalArgumentException("id cannot be null");
        }

        Position position = positionRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Position not found"));
        return mapToDto(position);
    }

    @Override
    public PositionResponse updatePosition(Integer id, PositionRequest request) {
        if(id == null || request == null){
            throw new IllegalArgumentException("id and request cannot be null");
        }

        Position position = positionRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Position not found"));
        position.setName(request.name());

        return mapToDto(positionRepo.save(position));
    }


    private PositionResponse mapToDto(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .name(position.getName())
                .build();
    }
}
