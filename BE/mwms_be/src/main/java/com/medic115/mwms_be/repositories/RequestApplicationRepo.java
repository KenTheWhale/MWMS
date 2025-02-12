package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.RequestApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestApplicationRepo extends JpaRepository<RequestApplication, Integer> {
}
