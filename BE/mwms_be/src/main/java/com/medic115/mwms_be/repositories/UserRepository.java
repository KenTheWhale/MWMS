package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Account;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<Account, Integer> {
    Optional<Account> findByUsername(String username);

}
