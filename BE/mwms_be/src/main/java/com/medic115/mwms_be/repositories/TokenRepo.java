package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;
public interface TokenRepo extends JpaRepository<Token, Integer> {
    Optional<Token> findByAccount_IdAndStatusAndType(int accountId, String status, String type);
    Optional<Token> findByValue(String value);

    @Query("SELECT t FROM Token t inner join Account a on t.account.id = a.id " +
            "where a.id = :accountId and t.status = 'active' " )
    List<Token> findAllValidTokensByUser(Integer accountId);

    List<Token> findAllByStatusAndAccount_Id(String status, int id);
}
