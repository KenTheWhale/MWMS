package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;
public interface TokenRepo extends JpaRepository<Token, Integer> {
    Optional<Token> findByValue(String value);

    List<Token> findAllByAccount_Id(int id);

    Optional<Token> findByValueAndStatus(String value, String status);

    List<Token> findAllByTypeAndStatusAndAccount_Id(String type, String status, int accountId);


}
