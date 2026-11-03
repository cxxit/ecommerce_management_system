package com.nexus.backend.registration.repository;

import com.nexus.backend.registration.model.Customer;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends CrudRepository<Customer, Long> {
    Optional<Customer> findByUuid(UUID uuid);
}
