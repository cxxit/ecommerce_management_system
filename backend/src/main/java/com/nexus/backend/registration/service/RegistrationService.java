package com.nexus.backend.registration.service;


import com.nexus.backend.registration.repository.CustomerRepository;
import com.nexus.backend.registration.repository.UserAccountRepository;
import org.springframework.stereotype.Service;

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
}
