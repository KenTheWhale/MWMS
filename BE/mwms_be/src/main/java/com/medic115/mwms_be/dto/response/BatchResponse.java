package com.medic115.mwms_be.dto.response;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record BatchResponse(
        Integer id,
        String code,
        int equipmentQty,
        LocalDate createdDate
) {
}
