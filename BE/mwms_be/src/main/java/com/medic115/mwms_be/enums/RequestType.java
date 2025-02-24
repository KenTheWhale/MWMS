package com.medic115.mwms_be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum RequestType {
    IMPORT("import"),
    EXPORT("export"),;

    private final String value;
}
