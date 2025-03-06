package com.medic115.mwms_be.implementors;

import com.medic115.mwms_be.dto.requests.AreaRequest;
import com.medic115.mwms_be.dto.response.AreaResponse;
import com.medic115.mwms_be.models.Area;
import com.medic115.mwms_be.repositories.AreaRepo;
import com.medic115.mwms_be.services.AreaService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaServiceImpl implements AreaService {

    private final AreaRepo areaRepo;

    @Override
    public void createArea(AreaRequest request) {
        if (request == null) throw new IllegalArgumentException("Request cannot be null");

        areaRepo.save(Area.builder()
                .name(request.name())
                .status(request.status())
                .square(request.square())
                .build()
        );
    }

    @Override
    public List<AreaResponse> getAllAreas() {
        List<Area> areas = areaRepo.findAll();
        if (areas.isEmpty()) {
            return null;
        }
        return areas.stream().map(this::mapToDto).toList();
    }

    @Override
    public AreaResponse getAreaById(Integer id) {
        if (id == null) throw new IllegalArgumentException("Id cannot be null");

        Area area = areaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Dont have area with: " + id));
        return mapToDto(area);
    }

    @Override
    public AreaResponse updateArea(Integer id, AreaRequest request) {
        if (id == null || request == null) throw new IllegalArgumentException("Id and request cannot be null");

        Area area = areaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Dont have area with: " + id));

        area.setName(request.name());
        area.setStatus(request.status());
        area.setSquare(request.square());

        areaRepo.save(area);

        return mapToDto(area);
    }

    @Override
    public AreaResponse deleteArea(Integer id, String status) {
        if(id == null || status == null) throw new IllegalArgumentException("Id and status cannot be null");

        Area area = areaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Dont have area with: " + id));
        area.setStatus(status);
        areaRepo.save(area);

        return mapToDto(area);
    }


    private AreaResponse mapToDto(Area area) {
        return AreaResponse.builder()
                .id(area.getId())
                .square(area.getSquare())
                .name(area.getName())
                .status(area.getStatus())
                .build();
    }
}
