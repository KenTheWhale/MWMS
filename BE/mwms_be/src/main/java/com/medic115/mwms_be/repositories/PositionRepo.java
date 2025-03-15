package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PositionRepo extends JpaRepository<Position, Integer> {

    @Query("SELECT COALESCE(SUM(p.square), 0) FROM Position p WHERE p.area.id = :areaId")
    int sumOfAllPositionsInArea(@Param("areaId") Integer areaId);

    @Query("SELECT COUNT(p) > 0 FROM Position p WHERE p.name = :positionName AND p.id <> :id")
    boolean existsByPositionNameAndNotId(@Param("positionName") String positionName, @Param("id") Integer id);

    @Query("SELECT COUNT(p) > 0 FROM Position p WHERE p.name = :positionName")
    boolean existsByPositionName(@Param("positionName") String positionName);
}
