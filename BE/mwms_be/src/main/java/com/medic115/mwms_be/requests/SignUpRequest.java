package com.medic115.mwms_be.requests;

public record SignUpRequest(
        String username,
        String password,
        String roleName,
        String name,
        String email,
        String phone
) {
}
