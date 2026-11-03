package com.nexus.backend.registration.controller;


import com.nexus.backend.registration.dto.RegistrationRequest;
import com.nexus.backend.registration.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController // tells spring this class handles HTTP requests and returns response data
@RequestMapping("/api/registration") // defines the base URL for registration endpoints
public class RegistrationController {
    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    //Registration endpoint
    @PostMapping
    public ResponseEntity<Void> register(
            @RequestBody RegistrationRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        String email = jwt.getClaimAsString("email");

        registrationService.registerCustomer(request, userId, email);

        return ResponseEntity.status(201).build();
    }
}

