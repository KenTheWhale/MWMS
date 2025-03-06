package com.medic115.mwms_be.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeWarehouseRequestStatusRequest {
    String code;
    String status;
    String username;
    LocalDate deliveryDate;
    String carrierName;
    String carrierPhone;
}
