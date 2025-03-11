package com.medic115.mwms_be.implementors;

import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.models.ItemGroup;
import com.medic115.mwms_be.models.Task;
import com.medic115.mwms_be.repositories.RequestItemRepo;
import com.medic115.mwms_be.repositories.TaskRepo;
import com.medic115.mwms_be.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final TaskRepo taskRepo;

    private final RequestItemRepo requestItemRepo;

    //-------------------------------------------TASK-------------------------------------------//
    @Override
    public ResponseEntity<ResponseObject> getTaskList(int id) {
        List<Task> tasks = taskRepo.findAllByUser_Id(id);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(buildTaskList(tasks))
                        .build()
        );
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
                    data.put("request", buildRequestApplicationFromGroup(task.getItemGroup()));
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
        data.put("rej", task.getItemGroup().getRejectionReason());
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
        DecimalFormat df = new DecimalFormat("#.##");

        return requestItemRepo.findAllByItemGroup_Id(group.getId()).stream()
                .map(item -> {
                    Map<String, Object> partner = new HashMap<>();
                    partner.put("id", item.getPartner().getId());
                    partner.put("name", item.getPartner().getUser().getName());


                    Map<String, Object> data = new HashMap<>();
                    data.put("id", item.getId());
                    data.put("equipment", item.getEquipment().getName());
                    data.put("category", item.getEquipment().getCategory().getName());
                    data.put("partner", partner);
                    data.put("quantity", item.getQuantity());
                    data.put("price", df.format(item.getUnitPrice()));
                    return data;
                })
                .toList();
    }
}
