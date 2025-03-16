package com.medic115.mwms_be.requests;
import java.util.List;
public record AreaRequest(
        String name,
        int square,
        Integer eqId
) {
}
