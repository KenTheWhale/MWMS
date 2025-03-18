package com.medic115.mwms_be.response;
import lombok.Builder;
import lombok.Data;
import java.util.List;


@Builder
@Data
public class AreaForStaffResponse {
    Integer areaId;
    Integer squareArea;
    String areaName;
    String areaStatus;
    Integer equipmentId;
    List<PositionResponse> positionList;
}
