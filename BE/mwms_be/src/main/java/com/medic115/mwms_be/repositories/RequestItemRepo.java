package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.RequestItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestItemRepo extends JpaRepository<RequestItem, Integer> {

    List<RequestItem> findAllByItemGroup_Id(int id);
}
