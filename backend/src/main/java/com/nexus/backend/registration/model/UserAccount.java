package com.nexus.backend.registration.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("user_account")
public class UserAccount {
    @Id
    @Column("uuid")
    private UUID uuid;
    @Column("username")
    private final String username;
    @Column("email")
    private final String email;

    public UserAccount(UUID uuid, String username, String email) {
        this.uuid = uuid;
        this.username = username;
        this.email = email;
    }

    public UUID getUuid() {
        return this.uuid;
    }

    public String getUsername() {
        return this.username;
    }

    public String getEmail() {
        return this.email;
    }

}
