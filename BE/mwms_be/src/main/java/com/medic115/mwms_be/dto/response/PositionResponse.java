package com.medic115.mwms_be.dto.response;

import java.util.List;
import lombok.Builder;

@Builder
public record PositionResponse(
        Integer id,
        String name,
        List<BatchResponse> batches
) {
}
