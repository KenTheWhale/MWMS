package com.medic115.mwms_be.services.implementors;

import com.medic115.mwms_be.requests.PositionRequest;
import com.medic115.mwms_be.response.BatchResponse;
import com.medic115.mwms_be.response.PositionResponse;
import com.medic115.mwms_be.models.Area;
import com.medic115.mwms_be.models.Batch;
import com.medic115.mwms_be.models.Position;
import com.medic115.mwms_be.repositories.AreaRepo;
import com.medic115.mwms_be.repositories.BatchItemRepo;
import com.medic115.mwms_be.repositories.BatchRepo;
import com.medic115.mwms_be.repositories.PositionRepo;
import com.medic115.mwms_be.services.PositionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionServiceImpl implements PositionService {

    private final PositionRepo positionRepo;

    private final AreaRepo areaRepo;

    private final BatchItemRepo batchItemRepo;

    private final BatchRepo batchRepo;

    @Override
    public ResponseEntity<?> createPosition(PositionRequest request) {
        if (request == null || request.areaId() == null) {
            throw new IllegalArgumentException("Request and area ID cannot be null");
        }

        Area area = areaRepo.findById(request.areaId())
                .orElseThrow(() -> new EntityNotFoundException("Area not found"));

        int usedSquare = positionRepo.sumOfAllPositionsInArea(request.areaId());

        int remainingSquare = area.getSquare() - usedSquare;

        if (remainingSquare < request.square()) {
            return ResponseEntity.badRequest().body("Only " + remainingSquare + " square meters left! Cannot create position.");
        }

        boolean check = positionRepo.existsByPositionName(request.name());

        if(check) {
            return ResponseEntity.badRequest().body("Position name already exists!");
        }

        Position position = Position.builder()
                .name(request.name())
                .square(request.square())
                .area(area)
                .build();

        positionRepo.save(position);
        try {
            return ResponseEntity.ok("Created position successfully!");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    public List<PositionResponse> getAllPosition(Integer areaId) {
        Area area = areaRepo.findById(areaId).orElseThrow(() -> new EntityNotFoundException("Area not found"));

        return area.getPositions().stream().map(this::mapPositionToDto1).toList();
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
    public ResponseEntity<?> updatePosition(Integer id, PositionRequest request) {
        if (id == null || request == null) {
            throw new IllegalArgumentException("id and request cannot be null");
        }

        Position position = positionRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Position not found"));

        Area area = areaRepo.findById(request.areaId())
                .orElseThrow(() -> new EntityNotFoundException("Area not found"));

        int totalUsedSquare = positionRepo.sumOfAllPositionsInArea(area.getId()) - position.getSquare();

        if (totalUsedSquare + request.square() > area.getSquare()) {
            return ResponseEntity.badRequest().body("Total square in this area cannot exceed " + area.getSquare() + "m²");
        }

        boolean check = positionRepo.existsByPositionNameAndNotId(request.name(), id);

        if(check){
            return ResponseEntity.badRequest().body("Position name already exists!");
        }

        if(!position.getBatches().isEmpty() && request.square() - sumTotalBatchSquare(position) < 0){
            return ResponseEntity.badRequest().body("Position size must not smaller than total batch size: " + sumTotalBatchSquare(position) + " m²");
        }

        position.setName(request.name());
        position.setArea(area);
        position.setSquare(request.square());

        positionRepo.save(position);

        return ResponseEntity.ok("Updated successfully!");
    }

    private int sumTotalBatchSquare(Position position) {
        int sum = 0;
        List<Batch> batches = position.getBatches();
        for (Batch batch : batches) {
            sum += batch.getLength() * batch.getWidth();
        }
        return sum;
    }

    @Transactional
    @Override
    public void deletePosition(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("id cannot be null");
        }

        Position position = positionRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Position not found"));

        // Lưu danh sách Batch cần xóa để tránh lỗi ConcurrentModificationException
        List<Batch> batchesToRemove = new ArrayList<>(position.getBatches());

        for (Batch batch : batchesToRemove) {
            // Gỡ liên kết giữa Batch và Position
            batch.setPosition(null);
            batchRepo.save(batch);

            // Xóa batchItems trước (đảm bảo không bị lỗi khóa ngoại)
            if (batch.getBatchItems() != null && !batch.getBatchItems().isEmpty()) {
                batchItemRepo.deleteAll(new ArrayList<>(batch.getBatchItems()));
                batch.getBatchItems().clear();
                batchRepo.save(batch);
            }

            // Gỡ liên kết với requestItem (Nhưng không xóa requestItem)
            if (batch.getRequestItem() != null) {
                batch.getRequestItem().setBatch(null);
                batch.setRequestItem(null);
                batchRepo.save(batch);
            }

            // Cuối cùng, xóa Batch
            batchRepo.delete(batch);
        }

        // Sau khi xóa hết Batch, xóa Position
        position.getBatches().clear();
        positionRepo.delete(position);
    }


    private PositionResponse mapPositionToDto1(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .name(position.getName())
                .square(position.getSquare())
                .build();
    }

    private PositionResponse mapPositionToDto2(Position position) {
        return PositionResponse.builder()
                .id(position.getId())
                .name(position.getName())
                .square(position.getSquare())
                .areaId(position.getArea().getId())
                .batches(position.getBatches().stream().map(this::mapBatchToDto).collect(Collectors.toList()))
                .build();
    }

    private BatchResponse mapBatchToDto(Batch batch) {
        return BatchResponse.builder()
                .id(batch.getId())
                .code(batch.getCode())
                .createdDate(batch.getCreatedDate())
                .build();
    }
}
