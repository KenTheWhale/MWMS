package com.medic115.mwms_be.response;
import com.medic115.mwms_be.models.Equipment;
import lombok.Builder;

@Builder
public record AreaResponse(
       Integer id,
       String name,
       String status,
       int square,
       EquipmentResponse equipment
) {
}
