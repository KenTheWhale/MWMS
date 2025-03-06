package com.medic115.mwms_be.validations;

import com.medic115.mwms_be.dto.requests.AssignStaffRequest;
import com.medic115.mwms_be.models.ItemGroup;
import com.medic115.mwms_be.models.User;
import com.medic115.mwms_be.repositories.ItemGroupRepo;
import com.medic115.mwms_be.repositories.UserRepo;

public class ManagerValidation {

    public static String validateAssignStaff(AssignStaffRequest request, UserRepo userRepo, ItemGroupRepo itemGroupRepo){
        User staff = userRepo.findById(request.getStaffId()).orElse(null);
        ItemGroup group = itemGroupRepo.findById(request.getGroupId()).orElse(null);
        if(staff == null){
            return "Staff not found";
        }

        if(group == null){
            return "Item group not found";
        }
        return "";
    }
}
