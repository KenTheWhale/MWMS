package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.RequestApplication;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RequestApplicationRepo extends JpaRepository<RequestApplication, Integer> {
    List<RequestApplication> findAllByRequestDate(LocalDate requestDate);


    @EntityGraph(attributePaths = {"items.equipment", "items.partner"})
    RequestApplication getRequestApplicationByCode(String code);

    RequestApplication findTopByOrderByIdDesc();
}
