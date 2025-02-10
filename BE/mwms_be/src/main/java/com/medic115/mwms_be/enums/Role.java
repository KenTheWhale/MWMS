package com.medic115.mwms_be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.medic115.mwms_be.enums.Permission.*;

@RequiredArgsConstructor
@Getter
public enum Role {
    ADMIN(
            Set.of(
                    ADMIN_CREATE,
                    ADMIN_UPDATE,
                    ADMIN_READ,
                    ADMIN_DELETE
            )
    ),
    MANAGER(
            Set.of(
                    MANAGER_CREATE,
                    MANAGER_READ,
                    MANAGER_UPDATE,
                    MANAGER_DELETE
            )
    ),
    STAFF(
            Set.of(
                    STAFF_CREATE,
                    STAFF_READ,
                    STAFF_UPDATE,
                    STAFF_DELETE
            )
    ),
    PARTNER(
            Set.of(
                    PARTNER_CREATE,
                    PARTNER_READ,
                    PARTNER_UPDATE,
                    PARTNER_DELETE
            )
    );

    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = new ArrayList<>(
                getPermissions().stream()
                        .map(permission -> new SimpleGrantedAuthority((permission.getPermission())))
                        .toList()
        );

        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
