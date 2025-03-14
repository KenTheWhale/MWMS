package com.medic115.mwms_be.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignStaffRequest {
    int staffId;
    int groupId;
    String description;
    LocalDate assignDate;
}
