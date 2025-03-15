package com.medic115.mwms_be.services.implementors;

import com.medic115.mwms_be.models.Position;
import com.medic115.mwms_be.repositories.PositionRepo;
import com.medic115.mwms_be.requests.AssignBatchRequest;
import com.medic115.mwms_be.response.BatchItemResponse;
import com.medic115.mwms_be.models.Batch;
import com.medic115.mwms_be.models.BatchItem;
import com.medic115.mwms_be.repositories.BatchRepo;
import com.medic115.mwms_be.services.BatchService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {

    private final BatchRepo batchRepo;

    private final PositionRepo positionRepo;

    @Override
    public List<BatchItemResponse> getAllBatchItems(Integer batchId) {

        Batch batch = batchRepo.findById(batchId).orElse(null);
        if (batch == null) {
            throw new EntityNotFoundException("Batch not found");
        }

        return batch.getBatchItems().stream().map(this::mapToDto).toList();
    }


    @Override
    @Transactional
    public void deleteBatch(Integer batchId) {
        Batch batch = batchRepo.findById(batchId).orElseThrow(() -> new EntityNotFoundException("Batch not found"));

        batch.getBatchItems().clear();
//        batchRepo.save(batch);
//        for(BatchItem batchItem : batchItems) {
//            batchItemRepo.delete(batchItem);
//        }
//        batch.setRequestItem(null);
        batch.getRequestItem().setBatch(null);
        batch.setRequestItem(null);

        batch.setPosition(null);

        batchRepo.flush();

        batchRepo.delete(batch);
        batchRepo.flush();
    }

    @Override
    public ResponseEntity<?> assignBatchToPosition(AssignBatchRequest request) {
        if(request == null) {
            return ResponseEntity.badRequest().body("Request cannot be null");
        }

        Position position = positionRepo.findById(request.getPositionId()).get();

        if(position == null) {
            return ResponseEntity.badRequest().body("Position not found");
        }

        Batch batch = batchRepo.findById(request.getBatchId()).get();

        if(batch == null) {
            return ResponseEntity.badRequest().body("Batch not found");
        }

        for(Batch x : position.getBatches()){
            if (x.getId() == request.getBatchId()) {
                return ResponseEntity.badRequest().body("Batch already assigned");
            }
        }

        int totalSquareOfBatchInPosition = batchRepo.sumOfAllBatchesInPosition(request.getPositionId());
        int remainingSquare = position.getSquare() - totalSquareOfBatchInPosition;

        if(remainingSquare < calculateSquare(batch.getLength(), batch.getWidth())) {
            return ResponseEntity.badRequest().body("Position just have " + remainingSquare + " square left");
        }

        batch.setPosition(position);
        batchRepo.save(batch);

        return ResponseEntity.ok("Batch assigned successfully!");
    }

    private BatchItemResponse mapToDto(BatchItem batchItem) {
        return BatchItemResponse.builder()
                .id(batchItem.getId())
                .importedDate(batchItem.getImportedDate())
                .serialNumber(batchItem.getSerialNumber())
                .build();
    }

    private int calculateSquare(int length, int width){
        int totalSquare = length * width;
        return totalSquare;
    }
}
