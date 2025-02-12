package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.RequestItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestItemRepo extends JpaRepository<RequestItem, Integer> {
}
