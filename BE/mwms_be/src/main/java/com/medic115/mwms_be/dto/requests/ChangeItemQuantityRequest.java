package com.medic115.mwms_be.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeItemQuantityRequest {

    int id;

    int quantity;
}
