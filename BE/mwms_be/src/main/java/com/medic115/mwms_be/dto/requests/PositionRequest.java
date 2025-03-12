package com.medic115.mwms_be.dto.requests;

public record PositionRequest(
        String name,
        int square,
        Integer areaId
) {
}
