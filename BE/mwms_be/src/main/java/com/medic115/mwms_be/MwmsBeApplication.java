package com.medic115.mwms_be;

import com.medic115.mwms_be.models.Account;
import com.medic115.mwms_be.models.Role;
import com.medic115.mwms_be.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Arrays;

@SpringBootApplication
public class MwmsBeApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    public static void main(String[] args) {
        SpringApplication.run(MwmsBeApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        Arrays.stream(Role.values()).forEach(role -> {
            boolean exist = userRepository.existsByRole(role);
            if(!exist) {
                String[] str = role.name().split("_");
                String username = str[str.length - 1].toLowerCase();

                Account account = Account.builder()
                        .username(username)
                        .password("12345")
                        .role(role)
                        .status(true)
                        .build();
                userRepository.save(account);
            }
        });
    }
}
