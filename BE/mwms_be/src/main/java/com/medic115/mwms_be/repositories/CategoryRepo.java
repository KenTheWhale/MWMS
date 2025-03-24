package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Integer> {

    Category findByName(String name);

    Category findByCode(String code);

    Category findByCodeAndStatus(String code, String status);

    void deleteByCode(String code);
}
