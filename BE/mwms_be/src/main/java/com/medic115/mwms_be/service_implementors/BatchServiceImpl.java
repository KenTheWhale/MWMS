package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.response.BatchItemResponse;
import com.medic115.mwms_be.models.Batch;
import com.medic115.mwms_be.models.BatchItem;
import com.medic115.mwms_be.repositories.BatchRepo;
import com.medic115.mwms_be.services.BatchService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {

    private final BatchRepo batchRepo;
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

    private BatchItemResponse mapToDto(BatchItem batchItem) {
        return BatchItemResponse.builder()
                .id(batchItem.getId())
                .importedDate(batchItem.getImportedDate())
                .serialNumber(batchItem.getSerialNumber())
                .build();
    }
}
