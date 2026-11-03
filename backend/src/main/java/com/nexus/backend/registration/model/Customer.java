package com.nexus.backend.registration.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.util.UUID;

@Table("customer")
public class Customer {
    @Id
    @Column("cust_id")
    private Long custId;
    @Column("uuid")
    private UUID uuid;
    @Column("cust_first_name")
    private String firstName;
    @Column("cust_last_name")
    private String lastName;
    @Column("cust_email")
    private String email;
    @Column("cust_gender")
    private String gender;
    @Column("cust_birth_date")
    private LocalDate birthDate;

    public Customer(
            UUID uuid,
            String firstName,
            String lastName,
            String email,
            String gender,
            LocalDate birthDate
    ) {
        this.uuid = uuid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
    }

    public Long getCustId() {
        return custId;
    }

    public UUID getUuid() {
        return uuid;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getGender() {
        return gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }
}
