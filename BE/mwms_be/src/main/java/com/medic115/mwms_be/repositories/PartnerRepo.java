package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Partner;
import com.medic115.mwms_be.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartnerRepo extends JpaRepository<Partner, Integer> {

    Optional<Partner> findByUser_Name(String userName);

    Optional<Partner> findByUser(User user);
}
