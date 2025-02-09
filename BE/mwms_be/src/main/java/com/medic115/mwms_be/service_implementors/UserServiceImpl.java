package com.medic115.mwms_be.service_implementors;

import com.medic115.mwms_be.dto.response.UserResponse;
import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.repositories.JwtRepository;
import com.medic115.mwms_be.repositories.UserRepository;
import com.medic115.mwms_be.services.JWTService;
import com.medic115.mwms_be.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtRepository jwtRepository;
    private final JWTService jwtService;


    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException(username + " is not found !"));
            }
        };
    }

    @Override
    public List<UserResponse> getAllAccountExceptAdmin() {
        return userRepository.findAllExceptAdmin().stream()
                .map(this::mapToDto).toList();
    }

    private UserResponse mapToDto(Account account) {
        return UserResponse.builder()
                .id(account.getId())
                .fullName(account.getFullName())
                .phone(account.getPhone())
                .gender(account.getGender())
                .role(account.getRole().toString())
                .status(account.getStatus())
                .build();
    }

    private Account getCurrentUser(HttpServletRequest request) {
        String token = extractTokenFromHeader(request);
        if (token == null) {
            throw new IllegalArgumentException("No JWT token found in the request header");
        }
        final var accessToken = jwtRepository.findByToken(token).orElse(null);
        if (accessToken == null) {
            throw new IllegalArgumentException("No JWT token is valid!");
        }
        String username = jwtService.extractUsername(token);
        var user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("Not Found User"));
        if (!jwtService.isTokenValid(token, user) || accessToken.isRevoked() || accessToken.isExpired()) {
            throw new IllegalArgumentException("JWT token has expired or been revoked");
        }
        return user;
    }

    private String extractTokenFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }
}
