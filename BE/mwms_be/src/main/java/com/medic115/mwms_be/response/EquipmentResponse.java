package com.medic115.mwms_be.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class EquipmentResponse {

    Integer id;

    String code;

    String name;

    String description;

    double price;

    String unit;

    String status;

    int threshold;
}
