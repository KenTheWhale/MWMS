package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepo extends JpaRepository<Task, Integer> {
    boolean existsByCode(String code);

    Optional<Task> findByCode(String code);

    List<Task> findAllByUser_Id(int userId);
}
