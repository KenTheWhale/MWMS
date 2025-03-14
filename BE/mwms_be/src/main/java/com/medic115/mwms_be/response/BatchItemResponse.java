package com.medic115.mwms_be.response;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record BatchItemResponse(
        Integer id,
        String serialNumber,
        LocalDate importedDate
) {
}
