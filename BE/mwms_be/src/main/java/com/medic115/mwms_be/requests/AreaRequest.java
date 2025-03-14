package com.medic115.mwms_be.requests;

public record AreaRequest(
        String name,
        String status,
        int square
) {
}
