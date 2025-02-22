package com.medic115.mwms_be.dto.requests;

public record AreaRequest(
        String name,
        String status,
        int square
) {
}
