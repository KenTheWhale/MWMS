package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepo extends JpaRepository<Equipment, Integer> {


    Equipment findByName(String name);

    Equipment findByCode(String code);

    List<Equipment> findAllByCodeContainingIgnoreCaseOrNameContainingIgnoreCase(String code, String name);

    void deleteByCode(String code);
}
