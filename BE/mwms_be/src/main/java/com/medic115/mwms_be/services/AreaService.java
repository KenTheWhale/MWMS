package com.medic115.mwms_be.services;


import org.springframework.http.ResponseEntity;
import com.medic115.mwms_be.requests.AreaRequest;
import com.medic115.mwms_be.response.AreaResponse;

import java.util.List;

public interface AreaService {

    ResponseEntity<?> createArea(AreaRequest request);

    List<AreaResponse> getAllAreas();

    AreaResponse getAreaById(Integer id);

    ResponseEntity<?> updateArea(Integer id, AreaRequest request);

    ResponseEntity<?> deleteArea(Integer id);

    ResponseEntity<?> restoreArea(Integer id);

//    ResponseEntity<?> getAllForStaff();
}
