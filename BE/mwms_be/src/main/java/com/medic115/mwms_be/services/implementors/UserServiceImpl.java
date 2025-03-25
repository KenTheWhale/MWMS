package com.medic115.mwms_be.services.implementors;

import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.response.AccountResponse;
import com.medic115.mwms_be.response.UserResponse;
import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.User;
import com.medic115.mwms_be.repositories.AccountRepo;
import com.medic115.mwms_be.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final AccountRepo accountRepo;

    @Override
    public UserDetailsService userDetailsService() {
        return null;
    }

    @Override
    public List<AccountResponse> getAllAccountExceptAdmin() {
        List<Account> accounts = accountRepo.findAllUsersExceptAdmin();
        List<AccountResponse> responses = accounts.stream().map(this::mapToDtoAccount).toList();

        return responses;
    }

    @Override
    public ResponseEntity<?> countAccountActive() {
        Integer count = accountRepo.countByStatusAndLogged(Status.ACCOUNT_ACTIVE.getValue(), true);

        return ResponseEntity.ok(count);
    }

    @Override
    public ResponseEntity<?> countAccountDeleted() {
        Integer count = accountRepo.countByStatusAndLogged(Status.ACCOUNT_DELETE.getValue(), false);

        return ResponseEntity.ok(count);
    }

    private AccountResponse mapToDtoAccount(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .username(account.getUsername())
                .status(account.getStatus())
                .role(account.getRole().name().equals("PARTNER") ? account.getUser().getPartner().getType() : account.getRole().name()  )
                .userResponse(mapToDtoUser(account.getUser()))
                .build();
    }

    private UserResponse mapToDtoUser(User user) {
        return UserResponse.builder()
                .phone(user.getPhone())
                .fullName(user.getName())
                .email(user.getEmail())
                .build();
    }
}
