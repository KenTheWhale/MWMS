package com.medic115.mwms_be.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditAccountRequest {
    String username;
    String password;
    String roleName;
    String name;
    String phone;
    String email;
}
