package com.medic115.mwms_be.utils;

import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.models.Token;
import com.medic115.mwms_be.repositories.TokenRepo;

public class TokenUtil {

    public static void handleExpiredToken(String jwt, TokenRepo tokenRepo) {
        Token token = tokenRepo.findByValueAndStatus(jwt, Status.TOKEN_ACTIVE.getValue()).orElse(null);
        if (token != null) {
            token.setStatus(Status.TOKEN_EXPIRED.getValue());
            tokenRepo.save(token);
        }
    }
}
