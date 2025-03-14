package com.medic115.mwms_be.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddForUpdateRequest {
    int partnerId;
    int equipmentId;
    int quantity;
    int groupId;
}
