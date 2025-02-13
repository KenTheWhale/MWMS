package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepo extends JpaRepository<Account, Integer> {
    Optional<Account> findByUsername(String username);

    Optional<Account> findByUsernameAndPassword(String username, String password);

    List<Account> findAllByRole(Role role);
}
