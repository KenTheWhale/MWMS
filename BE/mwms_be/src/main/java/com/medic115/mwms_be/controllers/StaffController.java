package com.medic115.mwms_be.controllers;

import com.medic115.mwms_be.requests.AssignBatchRequest;
import com.medic115.mwms_be.requests.CreateBatchRequest;
import com.medic115.mwms_be.response.ResponseObject;
import com.medic115.mwms_be.services.AreaService;
import com.medic115.mwms_be.services.BatchService;
import com.medic115.mwms_be.services.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    private final AreaService areaService;

    private final BatchService batchService;

    //-------------------------------------------TASK-------------------------------------------//
    @GetMapping("/task/{id}")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<ResponseObject> getTaskList(@PathVariable int id) {
        return staffService.getTaskList(id);
    }

    //-------------------------------------------BATCH-------------------------------------------//


    //-------------------------------------------Area-------------------------------------------//
//    @GetMapping("/area")
//    @PreAuthorize("hasRole('staff')")
//    public ResponseEntity<?> getAreaList() {
//        return areaService.getAllForStaff();
//    }

    @GetMapping("/area")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<ResponseObject> getAreaList() {
        return staffService.getAreaList();
    }

    //-------------------------------------------Batch-------------------------------------------//
    @PutMapping("/batch")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<?> assignBatchToPosition(@RequestBody AssignBatchRequest request){
        return batchService.assignBatchToPosition(request);
    }

    @PostMapping("/batch")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<ResponseObject> createBatch(@RequestBody CreateBatchRequest request){
        return staffService.createBatch(request);
    }
}
