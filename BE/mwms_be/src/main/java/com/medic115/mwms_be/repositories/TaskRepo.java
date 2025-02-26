package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    boolean existsByCode(String code);
}
