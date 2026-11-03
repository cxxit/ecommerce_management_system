package com.nexus.backend.registration.model;

public enum Gender {
    FEMALE("Female"),
    MALE("Male"),
    NON_BINARY("Non-Binary"),
    PREFER_NOT_TO_SAY("Prefer Not To Say"),
    OTHERS("Others");

    private final String databaseValue;

    Gender(String databaseValue) {
        this.databaseValue = databaseValue;
    }

    public String getDatabaseValue() {
        return databaseValue;
    }
}