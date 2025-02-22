package com.medic115.mwms_be.enums;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;


public enum Role {
    ADMIN,
    MANAGER,
    STAFF,
    PARTNER;

    public List<SimpleGrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(
                "ROLE_" + this.name().toLowerCase()));
    }
}
