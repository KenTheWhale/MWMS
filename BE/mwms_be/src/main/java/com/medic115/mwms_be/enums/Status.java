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
    REQUEST_CANCELLED("cancelled");
    private final String value;
}
