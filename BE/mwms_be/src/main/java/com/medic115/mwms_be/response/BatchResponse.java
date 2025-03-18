package com.medic115.mwms_be.response;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record BatchResponse(
        Integer id,
        String code,
        LocalDate createdDate
) {
}
