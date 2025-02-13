package com.medic115.mwms_be.dto.response;


import lombok.Builder;

@Builder
public record PositionResponse(
        Integer id,
        String name,
        String status
) {
}
