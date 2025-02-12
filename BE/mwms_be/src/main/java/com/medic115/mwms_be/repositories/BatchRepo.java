package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepo extends JpaRepository<Batch, Integer> {
}
