package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface JwtRepository extends JpaRepository<Token, Integer> {

    @Query("SELECT t from Token t inner join Account u on t.user.id=u.id " +
            "where u.id= :userId and (t.expired =false or t.revoked =false)")
    List<Token> findAllValidTokensByUser(Long userId);

    Optional<Token> findByToken(String token);

    Optional<Token> findByRefreshToken(String refreshToken);
}
