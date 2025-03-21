package com.medic115.mwms_be.validations;

import com.medic115.mwms_be.models.Equipment;
import com.medic115.mwms_be.repositories.EquipmentRepo;

public class DeleteEquipmentValidation {
    public static String validate(String code, EquipmentRepo equipmentRepo) {
        String error = null;
        Equipment equipment = equipmentRepo.findByCode(code);
        if (equipment == null) {
            error = "Equipment name has already deleted or not existed";
        }
        //check if equipment is being used in some tasks
        //check if equipment is being used in some requests
        //check if equipment is being used in some groups
        //check if equipment is being used in some areas
        return error;
    }
}
