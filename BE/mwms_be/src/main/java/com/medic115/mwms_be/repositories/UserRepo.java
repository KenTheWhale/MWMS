package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email AND u.id <> :id")
    boolean existsByEmailAndNotId(String email, Integer id);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.phone = :phone AND u.id <> :id")
    boolean existsByPhoneAndNotId(String phone, Integer id);
}
