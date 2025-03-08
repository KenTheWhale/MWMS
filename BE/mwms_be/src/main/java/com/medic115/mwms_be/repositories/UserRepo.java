package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {


    Optional<User> findByEmail(String email);
}
