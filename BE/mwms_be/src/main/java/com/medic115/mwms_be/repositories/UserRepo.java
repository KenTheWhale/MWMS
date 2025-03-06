package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
public interface UserRepo extends JpaRepository<User, Integer> {

    @Query("SELECT u FROM User u WHERE u.account.role != 'ADMIN'")
    List<User> findAllUsersExceptAdmin();
}
