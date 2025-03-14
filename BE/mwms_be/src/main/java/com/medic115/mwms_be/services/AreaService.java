package com.medic115.mwms_be.services;

import com.medic115.mwms_be.requests.AreaRequest;
import com.medic115.mwms_be.response.AreaResponse;

import java.util.List;

public interface AreaService {

    void createArea(AreaRequest request);

    List<AreaResponse> getAllAreas();

    AreaResponse getAreaById(Integer id);

    AreaResponse updateArea(Integer id, AreaRequest request);

    AreaResponse deleteArea(Integer id, String status);

}
