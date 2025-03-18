package com.medic115.mwms_be.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {
    private int id;
    private String role;
    private String status;
    private String username;
    private UserResponse userResponse;
}
