package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepo extends JpaRepository<Partner, Integer> {
    Partner findByName(String name);
}
