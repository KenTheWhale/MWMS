package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BatchRepo extends JpaRepository<Batch, Integer> {
    @Query("SELECT COALESCE(SUM(b.length * b.width), 0) FROM Batch b WHERE b.position.id = :positionId")
    int sumOfAllBatchesInPosition(@Param("positionId") Integer positionId);

}
