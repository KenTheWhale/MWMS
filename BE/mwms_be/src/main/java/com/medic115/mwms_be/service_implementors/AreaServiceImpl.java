package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.requests.AreaRequest;
import com.medic115.mwms_be.dto.response.AreaResponse;
import com.medic115.mwms_be.models.Area;
import com.medic115.mwms_be.repositories.AreaRepository;
import com.medic115.mwms_be.services.AreaService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaServiceImpl implements AreaService {

    private final AreaRepository areaRepository;

    @Override
    public void createArea(AreaRequest request) {
        if (request == null) throw new IllegalArgumentException("Request cannot be null");

        areaRepository.save(Area.builder()
                .name(request.name())
                .status(request.status())
                .maxQty(request.maxQty())
                .build()
        );
    }

    @Override
    public List<AreaResponse> getAllAreas() {
        List<Area> areas = areaRepository.findAll();
        if (areas.isEmpty()) {
            return null;
        }
        return areas.stream().map(this::mapToDto).toList();
    }

    @Override
    public AreaResponse getAreaById(Integer id) {
        if (id == null) throw new IllegalArgumentException("Id cannot be null");

        Area area = areaRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Dont have area with: " + id));
        return mapToDto(area);
    }

    @Override
    public AreaResponse updateArea(Integer id, AreaRequest request) {
        if (id == null || request == null) throw new IllegalArgumentException("Id and request cannot be null");

        Area area = areaRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Dont have area with: " + id));

        area.setName(request.name());
        area.setStatus(request.status());
        area.setMaxQty(request.maxQty());

        areaRepository.save(area);

        return mapToDto(area);
    }


    private AreaResponse mapToDto(Area area) {
        return AreaResponse.builder()
                .id(area.getId())
                .maxQty(area.getMaxQty())
                .name(area.getName())
                .status(area.getStatus())
                .build();
    }
}
