package com.medic115.mwms_be.validations;

import com.medic115.mwms_be.requests.UpdateEquipmentRequest;
import com.medic115.mwms_be.models.Equipment;
import com.medic115.mwms_be.repositories.EquipmentRepo;

public class UpdateEquipmentValidation {
    public static String validate(UpdateEquipmentRequest request, EquipmentRepo equipmentRepo) {
        String error = null;
        Equipment equipment = equipmentRepo.findByCode(request.getCode());
        if (equipment == null) {
            error = "Equipment name has already deleted or not existed";
        }
        return error;
    }
}
