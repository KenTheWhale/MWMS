package com.medic115.mwms_be.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateImportRequest {
    int requestItemId;
    int equipmentId;
    int quantity;
}
