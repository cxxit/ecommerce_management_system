package com.nexus.backend.registration.dto;

import java.time.LocalDate;

// record - java class designed primarily to store and transfer data
public record RegistrationRequest(
    String username,
    String firstName,
    String lastName,
    String gender,
    LocalDate birthDate
) {}
