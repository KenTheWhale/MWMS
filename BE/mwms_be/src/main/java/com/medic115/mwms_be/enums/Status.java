package com.medic115.mwms_be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Status {
    TOKEN_ACTIVE("active"),
    TOKEN_EXPIRED("expired"),
    ACCOUNT_ACTIVE("active"),
    ACCOUNT_BLOCK("blocked"),
    ACCOUNT_DELETE("deleted"),
    REQUEST_PENDING("pending"),
    REQUEST_REJECTED("rejected"),
    REQUEST_ACCEPTED("accepted"),
    REQUEST_CANCELLED("canceled"),
    AREA_AVAILABLE("available"),
    AREA_FULL("full"),
    TASK_PROCESSING("processing"),
    TASK_ASSIGNED("assigned"),
    TASK_COMPLETED("completed"),
    EQUIPMENT_ACTIVE("active"),
    EQUIPMENT_DELETED("deleted");
    private final String value;
}
