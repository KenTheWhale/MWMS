package com.medic115.mwms_be.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddEquipmentRequest {

    String code;

    String name;

    String description;

    int categoryId;

    String unit;

    int threshHold;

}
