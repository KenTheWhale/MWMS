package com.medic115.mwms_be.services.implementors;

import com.medic115.mwms_be.enums.CodeFormat;
import com.medic115.mwms_be.models.*;
import com.medic115.mwms_be.repositories.*;
import com.medic115.mwms_be.requests.CreateBatchRequest;
import com.medic115.mwms_be.requests.GetRawBatchRequest;
import com.medic115.mwms_be.response.ResponseObject;
import com.medic115.mwms_be.services.StaffService;
import com.medic115.mwms_be.utils.ResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final TaskRepo taskRepo;

    private final RequestItemRepo requestItemRepo;

    private final AreaRepo areaRepo;

    private final PositionRepo positionRepo;

    private final BatchRepo batchRepo;

    private final BatchItemRepo batchItemRepo;

    //-------------------------------------------TASK-------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> getTaskList(int id) {
        List<Task> tasks = taskRepo.findAllByUser_Id(id);
        return ResponseUtil.build(HttpStatus.OK, "", true, buildTaskList(tasks));
    }

    private List<Map<String, Object>> buildTaskList(List<Task> tasks) {
        return tasks.stream()
                .map(task -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", task.getId());
                    data.put("code", task.getCode());
                    data.put("description", task.getDescription());
                    data.put("status", task.getStatus());
                    data.put("group", buildGroupFromTask(task));
                    data.put("requestApp", buildRequestApplicationFromGroup(task.getItemGroup()));
                    data.put("items", buildRequestItemListFromGroup(task.getItemGroup()));
                    return data;
                })
                .toList();
    }

    private Map<String, Object> buildGroupFromTask(Task task) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", task.getItemGroup().getId());
        data.put("cName", task.getItemGroup().getCarrierName());
        data.put("cPhone", task.getItemGroup().getCarrierPhone());
        data.put("deliveryDate", task.getItemGroup().getDeliveryDate());
        data.put("status", task.getItemGroup().getStatus());
        return data;
    }

    private Map<String, Object> buildRequestApplicationFromGroup(ItemGroup group){
        Map<String, Object> data = new HashMap<>();
        data.put("id", group.getRequestApplication().getId());
        data.put("code", group.getRequestApplication().getCode());
        data.put("requestDate", group.getRequestApplication().getRequestDate());
        data.put("modifiedDate", group.getRequestApplication().getLastModifiedDate());
        data.put("type", group.getRequestApplication().getType());
        return data;
    }

    private List<Map<String, Object>> buildRequestItemListFromGroup(ItemGroup group){

        return requestItemRepo.findAllByItemGroup_Id(group.getId()).stream()
                .map(item -> {
                    Map<String, Object> partner = new HashMap<>();
                    partner.put("id", item.getPartner().getId());
                    partner.put("name", item.getPartner().getUser().getName());


                    Map<String, Object> data = new HashMap<>();
                    data.put("id", item.getId());
                    data.put("eqId", item.getEquipment().getId());
                    data.put("equipment", item.getEquipment().getName());
                    data.put("category", item.getEquipment().getCategory().getName());
                    data.put("partner", partner);
                    data.put("quantity", item.getQuantity());
                    data.put("unit", item.getEquipment().getUnit());
                    return data;
                })
                .toList();
    }

    //-------------------------------------------AREA-------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> getAreaList() {
        return ResponseUtil.build(HttpStatus.OK, "", true, getAreas());
    }

    private List<Map<String, Object>> getAreas(){
        return areaRepo.findAll().stream().map(
                area -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", area.getId());
                    data.put("name", area.getName());
                    data.put("status", area.getStatus());
                    data.put("square", area.getSquare());
                    data.put("equipment", getEquipmentByArea(area));
                    data.put("positionList", getPositionsByArea(area));
                    return data;
                }
        ).toList();
    }

    private Map<String, Object> getEquipmentByArea(Area area){
        Map<String, Object> data = new HashMap<>();
        data.put("id", area.getEquipment().getId());
        data.put("code", area.getEquipment().getCode());
        data.put("name", area.getEquipment().getName());
        data.put("unit", area.getEquipment().getUnit());
        return data;
    }

    private List<Map<String, Object>> getPositionsByArea(Area area){
        return area.getPositions().stream().map(
                position -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", position.getId());
                    data.put("name", position.getName());
                    data.put("square", position.getSquare());
                    return data;
                }
        ).toList();
    }

    //-------------------------------------------BATCH-------------------------------------------//

    @Override
    public ResponseEntity<ResponseObject> createBatch(CreateBatchRequest request) {
        Position position = positionRepo.findById(request.getPositionId()).orElse(null);
        if (position == null){
            return ResponseUtil.build(HttpStatus.OK, "Position invalid", false, null);
        }
        RequestItem item = requestItemRepo.findById(request.getRequestItemId()).orElse(null);
        if (item == null){
            return ResponseUtil.build(HttpStatus.OK, "Item invalid", false, null);
        }

        int batchSquare = request.getLength() * request.getWidth();
        if(position.getSquare() - batchSquare <= 0){
            return ResponseUtil.build(HttpStatus.OK, "No space for this batch", false, null);
        }

        position = calculateSquare(position, batchSquare);

        LocalDate now = LocalDate.now();

        List<Batch> batches = batchRepo.findAll();

        int newCodeValue = batches.isEmpty() ? 1 : Integer.parseInt(batches.get(batches.size() - 1).getCode().split("-")[1]) + 1;

        Batch batch = batchRepo.save(
                Batch.builder()
                        .length(request.getLength())
                        .width(request.getWidth())
                        .code(CodeFormat.BATCH.getValue() + newCodeValue)
                        .requestItem(item)
                        .position(position)
                        .createdDate(now)
                        .build()
        );

        createBatchItem(batch, request.getQuantity(), now);
        return ResponseUtil.build(HttpStatus.OK, "Batch created successfully", true, null);
    }

    private Position calculateSquare(Position position, int batchSquare){
        position.setSquare(position.getSquare() - batchSquare);
        position.getArea().setSquare(position.getArea().getSquare() - batchSquare);
        return positionRepo.save(position);
    }

    private void createBatchItem(Batch batch, int quantity, LocalDate now){
        for(int i = 0; i < quantity; i++){
            List<BatchItem> items = batchItemRepo.findAll();

            int newCodeValue = items.isEmpty() ? 1 : Integer.parseInt(items.get(items.size() - 1).getSerialNumber().split("-")[1]) + 1;

            batchItemRepo.save(
                    BatchItem.builder()
                            .batch(batch)
                            .importedDate(now)
                            .serialNumber(CodeFormat.BATCH_ITEM.getValue() + newCodeValue)
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getBatchList() {
        List<Map<String, Object>> data = batchRepo.findAll().stream().map(
                batch -> {
                    Map<String, Object> dataItem = new HashMap<>();
                    return dataItem;
                }
        ).toList();

        return null;
    }
}
