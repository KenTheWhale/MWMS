package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.BatchItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchItemRepo extends JpaRepository<BatchItem, Integer> {
}
