package com.medic115.mwms_be.requests;

public record PositionRequest(
        String name,
        int square,
        Integer areaId
) {
}
