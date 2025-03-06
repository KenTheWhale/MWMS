package com.medic115.mwms_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private int id;
    private String role;
    private String phone;
    private String status;
    private String fullName;
    private Boolean gender;
}
