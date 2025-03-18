package com.medic115.mwms_be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CodeFormat {
    TASK("TSK-"),
    BATCH("BAT-"),
    BATCH_ITEM("BATI-");

    private final String value;
}
