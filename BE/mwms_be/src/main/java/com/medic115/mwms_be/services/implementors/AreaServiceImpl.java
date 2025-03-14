package com.medic115.mwms_be.services.implementors;


import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.models.Position;
import com.medic115.mwms_be.requests.AreaRequest;
import com.medic115.mwms_be.response.AreaForStaffResponse;
import com.medic115.mwms_be.response.AreaResponse;
import com.medic115.mwms_be.models.Area;
import com.medic115.mwms_be.repositories.AreaRepo;
import com.medic115.mwms_be.repositories.PositionRepo;
import com.medic115.mwms_be.response.PositionResponse;
import com.medic115.mwms_be.services.AreaService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AreaServiceImpl implements AreaService {

    private final AreaRepo areaRepo;

    private final PositionRepo positionRepo;

    @Override
    public ResponseEntity<?> createArea(AreaRequest request) {
        if (request == null) throw new IllegalArgumentException("Request cannot be null");

        boolean check = areaRepo.existsByAreaName(request.name());

        if (check) {
            return ResponseEntity.badRequest().body("Area name already exists !");
        }

        areaRepo.save(Area.builder()
                .name(request.name())
                .status(Status.AREA_AVAILABLE.getValue())
                .square(request.square())
                .build()
        );
        return ResponseEntity.ok("Area has been created !");
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
    public ResponseEntity<?> updateArea(Integer id, AreaRequest request) {
        if (id == null || request == null) throw new IllegalArgumentException("Id and request cannot be null");

        Area area = areaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Dont have area with: " + id));

        boolean check = areaRepo.existsByAreaNameAndNotId(request.name(), id);

        if(check){
            return ResponseEntity.badRequest().body("Area name is already exist!");
        }

        if(!area.getPositions().isEmpty() && request.square() < area.getSquare()){
            return ResponseEntity.badRequest().body("Area is still have positions");
        }

        area.setName(request.name());
        area.setSquare(request.square());

        areaRepo.save(area);

        return ResponseEntity.ok("Update successfully !");
    }

    @Override
    public ResponseEntity<?> deleteArea(Integer id) {
        if(id == null) throw new IllegalArgumentException("Id cannot be null");

        Area area = areaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Dont have area with: " + id));
        area.setStatus(Status.AREA_DELETED.getValue());
        areaRepo.save(area);

        return ResponseEntity.ok("Area has been deleted !");
    }

    @Override
    public ResponseEntity<?> restoreArea(Integer id) {
        if(id == null) throw new IllegalArgumentException("Id cannot be null");

        Area area = areaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Dont have area with: " + id));
        area.setStatus(Status.AREA_AVAILABLE.getValue());
        areaRepo.save(area);

        return ResponseEntity.ok("Area has been restored !");
    }

    @Override
    public ResponseEntity<?> getAllForStaff() {
        List<Area> areas = areaRepo.findAll();

        List<AreaForStaffResponse> responses = areas.stream().map(this::mapToDto2).toList();

        return ResponseEntity.ok(responses);
    }

    private AreaForStaffResponse mapToDto2(Area area) {
        return AreaForStaffResponse.builder()
                .areaId(area.getId())
                .areaName(area.getName())
                .areaStatus(area.getStatus())
                .squareArea(area.getSquare())
                .equipmentId(area.getEquipment().getId())
                .positions(area.getPositions().stream().map(this::mapToDto3).toList())
                .build();
    }

    private PositionResponse mapToDto3(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .name(position.getName())
                .square(position.getSquare())
                .build();
    }


    private AreaResponse mapToDto(Area area) {
        return AreaResponse.builder()
                .id(area.getId())
                .square(area.getSquare())
                .name(area.getName())
                .status(area.getStatus())
                .build();
    }

    @Scheduled(cron = "0 0/1 6-23 * * ?") // Chạy mỗi 5 phút từ 6h sáng đến 11:59 tối
    private void updateStatusAreaSchedule(){
        List<Area> areas = areaRepo.findAll();
        for(Area area : areas){
            int checkIsFull = positionRepo.sumOfAllPositionsInArea(area.getId());
            if(area.getSquare() == checkIsFull){
                area.setStatus(Status.AREA_FULL.getValue());
                areaRepo.save(area);
            } else {
                area.setStatus(Status.AREA_AVAILABLE.getValue());
                areaRepo.save(area);
            }
        }
    }
}
