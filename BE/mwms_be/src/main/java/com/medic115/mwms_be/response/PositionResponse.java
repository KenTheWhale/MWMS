package com.medic115.mwms_be.response;

import java.util.List;
import lombok.Builder;

@Builder
public record PositionResponse(
        Integer id,
        String name,
        Integer square,
        Integer areaId,
        List<BatchResponse> batches
) {
}
