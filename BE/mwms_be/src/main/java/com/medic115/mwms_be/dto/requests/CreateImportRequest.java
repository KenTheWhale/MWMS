package com.medic115.mwms_be.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateImportRequest {
    String equipmentName;
    String partnerName;
    int quantity;
}
