package com.medic115.mwms_be.implementors;

import com.medic115.mwms_be.dto.response.UserResponse;
import com.medic115.mwms_be.models.User;
import com.medic115.mwms_be.repositories.UserRepo;
import com.medic115.mwms_be.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    @Override
    public UserDetailsService userDetailsService() {
        return null;
    }

    @Override
    public List<UserResponse> getAllAccountExceptAdmin() {
        List<User> user = userRepo.findAllUsersExceptAdmin();
        List<UserResponse> responses = user.stream().map(this::mapToDto).toList();

        return responses;
    }

    private UserResponse mapToDto(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .role(user.getAccount().getRole().name())
                .fullName(user.getName())
                .status(user.getAccount().getStatus())
                .build();
    }
}
