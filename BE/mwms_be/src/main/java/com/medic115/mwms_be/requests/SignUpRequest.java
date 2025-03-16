package com.medic115.mwms_be.requests;

import lombok.Builder;
import java.util.List;

@Builder
public record SignUpRequest(
        String username,
        String password,
        String roleName,
        String name,
        String email,
        String phone,
        List<Integer> eqIds
) {
}
