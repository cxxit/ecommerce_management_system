package com.nexus.backend.registration.service;


import com.nexus.backend.registration.dto.RegistrationRequest;
import com.nexus.backend.registration.model.Customer;
import com.nexus.backend.registration.model.UserAccount;
import com.nexus.backend.registration.repository.CustomerRepository;
import com.nexus.backend.registration.repository.UserAccountRepository;
import org.springframework.data.jdbc.core.JdbcAggregateTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service // tells Spring that this class contains business logic
public class RegistrationService {

    private final UserAccountRepository userAccountRepository; // stores references to the repositories
    private final CustomerRepository customerRepository;
    private final JdbcAggregateTemplate jdbcAggregateTemplate;

    // the constructor is so that allow spring to inject the repositories automatically
    public RegistrationService (
            UserAccountRepository userAccountRepository,
            CustomerRepository customerRepository,
            JdbcAggregateTemplate jdbcAggregateTemplate
    ) {
        this.userAccountRepository = userAccountRepository;
        this.customerRepository = customerRepository;
        this.jdbcAggregateTemplate = jdbcAggregateTemplate;
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

        UserAccount userAccount = new UserAccount(
                authenticatedUserId,
                request.username(),
                authenticatedEmail
        );

        Customer customer = new Customer(
                authenticatedUserId,
                request.firstName(),
                request.lastName(),
                authenticatedEmail,
                request.gender(),
                request.birthDate()
        );

        jdbcAggregateTemplate.insert(userAccount);
        customerRepository.save(customer);




    }
}
