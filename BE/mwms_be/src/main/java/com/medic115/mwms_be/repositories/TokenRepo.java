package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepo extends JpaRepository<Token, Integer> {
    Optional<Token> findByAccount_IdAndStatusAndType(int accountId, String status, String type);
}
