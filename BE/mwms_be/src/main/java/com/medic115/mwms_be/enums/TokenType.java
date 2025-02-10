package com.medic115.mwms_be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum TokenType {
    ACCESS("access"),
    REFRESH("refresh");

    private final String value;
}
