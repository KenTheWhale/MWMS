package com.medic115.mwms_be.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateEquipmentRequest {

    int eqId;

    String name;

    String description;

    String code;

    LocalDate expiredDate;

    String category;

    String unit;

    double price;

    int quantity;

}
