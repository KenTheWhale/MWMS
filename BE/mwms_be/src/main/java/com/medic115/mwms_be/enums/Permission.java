package com.medic115.mwms_be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Permission {
    ADMIN_CREATE("admin:create"),
    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_DELETE("admin:delete"),

    MANAGER_CREATE("manager:create"),
    MANAGER_READ("manager:read"),
    MANAGER_UPDATE("manager:update"),
    MANAGER_DELETE("manager:delete"),

    STAFF_CREATE("staff:create"),
    STAFF_READ("staff:read"),
    STAFF_UPDATE("staff:update"),
    STAFF_DELETE("staff:delete"),

    PARTNER_CREATE("partner:create"),
    PARTNER_READ("partner:read"),
    PARTNER_UPDATE("partner:update"),
    PARTNER_DELETE("partner:delete");

    private final String permission;
}
