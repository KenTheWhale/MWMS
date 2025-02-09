package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<Account, Integer> {
    Optional<Account> findByUsername(String username);

//    Account findByRole(Role role);

    boolean existsByRole(Role role);

    @Query("SELECT a FROM Account a WHERE a.role <> 'ROLE_ADMIN'")
    List<Account> findAllExceptAdmin();
}
