package com.medic115.mwms_be.response;
import lombok.Builder;

@Builder
public record AreaResponse(
       Integer id,
       String name,
       String status,
       int square
) {
}
