package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.response.ResponseObject;
import com.medic115.mwms_be.enums.Role;
import com.medic115.mwms_be.repositories.AccountRepo;
import com.medic115.mwms_be.services.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final AccountRepo accountRepo;

    @Override
    public ResponseEntity<ResponseObject> getStaffList() {
        List<Map<String, Object>> data = accountRepo.findAllByRole(Role.STAFF).stream()
                .map(
                        account -> {
                            Map<String, Object> item = new HashMap<>();
                            item.put("username", account.getUsername());
                            item.put("phone", account.getPhone());
                            item.put("status", account.getStatus());
                            return item;
                        }
                )
                .toList();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .data(data)
                        .build()
        );
    }
}
