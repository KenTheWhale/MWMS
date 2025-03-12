package com.medic115.mwms_be.repositories;

import com.medic115.mwms_be.models.PartnerEquipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartnerEquipmentRepo extends JpaRepository<PartnerEquipment, Integer> {

    List<PartnerEquipment> findAllByPartner_Id(Integer partnerId);

    List<PartnerEquipment> findAllByEquipment_Id(Integer equipmentId);
}
