package com.medic115.mwms_be.services;

import com.medic115.mwms_be.response.AccountResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;
public interface UserService {

    UserDetailsService userDetailsService();

    List<AccountResponse> getAllAccountExceptAdmin();

    ResponseEntity<?> countAccountActive();

    ResponseEntity<?> countAccountDeleted();

}
