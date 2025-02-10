package com.medic115.mwms_be.config;



import com.medic115.mwms_be.enums.Status;
import com.medic115.mwms_be.enums.TokenType;
import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Token;
import com.medic115.mwms_be.repositories.AccountRepo;
import com.medic115.mwms_be.repositories.TokenRepo;
import com.medic115.mwms_be.services.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {


    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;
    private final AccountRepo accountRepo;
    private final TokenRepo tokenRepo;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        String jwt;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            Account account = accountRepo.findByUsername(userDetails.getUsername()).orElse(null);
            if (account == null || !account.getStatus().equalsIgnoreCase(Status.ACCOUNT_ACTIVE.getValue())) {
                filterChain.doFilter(request, response);
                return;
            }

            Token refresh = jwtService.checkTokenIsValid(account, TokenType.REFRESH.getValue());
            Token access = jwtService.checkTokenIsValid(account, TokenType.ACCESS.getValue());

            if (access == null) {
                // if both are null then return 403
                if (refresh == null) {
                    filterChain.doFilter(request, response);
                    return;
                }
                //if access is null but refresh is not => create new access
                tokenRepo.save(Token.builder()
                        .value(jwtService.generateAccessToken(account))
                        .type(TokenType.ACCESS.getValue())
                        .account(account)
                        .status(Status.TOKEN_ACTIVE.getValue())
                        .build()
                );
            }


            //grant permission
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);
    }
}
