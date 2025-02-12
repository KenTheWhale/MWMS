package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Position;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionRepo extends JpaRepository<Position, Integer> {
}
