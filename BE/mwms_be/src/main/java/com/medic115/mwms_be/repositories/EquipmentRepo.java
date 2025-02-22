package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentRepo extends JpaRepository<Equipment, Integer> {
}
