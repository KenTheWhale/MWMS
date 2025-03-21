package com.medic115.mwms_be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Type {
    TOKEN_ACCESS("access"),
    TOKEN_REFRESH("refresh"),
    REQUEST_IMPORT("import"),
    REQUEST_EXPORT("export"),
    TASK_IMPORT("import"),
    TASK_REPLACE("replace");
    private final String value;
}
