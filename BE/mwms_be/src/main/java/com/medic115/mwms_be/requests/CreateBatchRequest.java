package com.medic115.mwms_be.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateBatchRequest {
    int quantity;
    int requestItemId;
    int length;
    int width;
    int positionId;
}
