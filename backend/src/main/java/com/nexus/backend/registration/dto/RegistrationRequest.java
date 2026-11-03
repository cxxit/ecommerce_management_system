package com.nexus.backend.registration.dto;

import com.nexus.backend.registration.model.Gender;

import java.time.LocalDate;

// record - java class designed primarily to store and transfer data
public record RegistrationRequest(
    String username,
    String firstName,
    String lastName,
    Gender gender,
    LocalDate birthDate
) {}
