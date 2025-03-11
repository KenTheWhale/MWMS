package com.medic115.mwms_be.services;

import com.medic115.mwms_be.dto.response.AccountResponse;

import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;
public interface UserService {

    UserDetailsService userDetailsService();

    List<AccountResponse> getAllAccountExceptAdmin();
}
