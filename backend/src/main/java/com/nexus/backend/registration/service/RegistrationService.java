package com.nexus.backend.registration.service;


import com.nexus.backend.registration.dto.RegistrationRequest;
import com.nexus.backend.registration.repository.CustomerRepository;
import com.nexus.backend.registration.repository.UserAccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service // tells Spring that this class contains business logic
public class RegistrationService {

    private final UserAccountRepository userAccountRepository; // stores references to the repositories
    private final CustomerRepository customerRepository;

    // the constructor is so that allow spring to inject the repositories automatically
    public RegistrationService (
            UserAccountRepository userAccountRepository,
            CustomerRepository customerRepository
    ) {
        this.userAccountRepository = userAccountRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public void registerCustomer(RegistrationRequest request, UUID authenticatedUserId, String authenticatedEmail) {
        if (userAccountRepository.existsById(authenticatedUserId)) {
            throw new IllegalArgumentException("Account already registered");
        }

        // Check whether the username is already taken
        if (userAccountRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists");
        }
    }
}
