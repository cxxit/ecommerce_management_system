package com.nexus.backend.registration.repository;

import com.nexus.backend.registration.model.UserAccount;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface UserAccountRepository extends CrudRepository<UserAccount, UUID> {
    boolean existsByUsername(String username);
}
