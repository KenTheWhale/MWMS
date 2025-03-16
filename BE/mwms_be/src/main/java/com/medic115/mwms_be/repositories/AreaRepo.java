package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AreaRepo extends JpaRepository<Area, Integer> {

    @Query("SELECT COUNT(a) > 0 FROM Area a WHERE a.name = :areaName AND a.id <> :id")
    boolean existsByAreaNameAndNotId(@Param("areaName") String areaName, @Param("id") Integer id);

    @Query("SELECT COUNT(a) > 0 FROM Area a WHERE a.name = :name")
    boolean existsByAreaName(String name);

}
