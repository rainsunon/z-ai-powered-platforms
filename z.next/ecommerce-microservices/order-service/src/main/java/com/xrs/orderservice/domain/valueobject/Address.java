package com.xrs.orderservice.domain.valueobject;

import java.util.Objects;

/**
 * Value object representing a shipping address
 * Immutable and validates address components
 */
public record Address(
        String street,
        String city,
        String state,
        String zipCode,
        String country
) {

    public Address {
        Objects.requireNonNull(street, "Street cannot be null");
        Objects.requireNonNull(city, "City cannot be null");
        Objects.requireNonNull(state, "State cannot be null");
        Objects.requireNonNull(zipCode, "Zip code cannot be null");
        Objects.requireNonNull(country, "Country cannot be null");

        if (street.isBlank()) {
            throw new IllegalArgumentException("Street cannot be blank");
        }
        if (city.isBlank()) {
            throw new IllegalArgumentException("City cannot be blank");
        }
        if (zipCode.isBlank()) {
            throw new IllegalArgumentException("Zip code cannot be blank");
        }
    }

    public String toFullAddressString() {
        return String.format("%s, %s, %s %s, %s", street, city, state, zipCode, country);
    }

    public static Address fromString(String fullAddress) {
        if (fullAddress == null || fullAddress.isBlank()) {
            throw new IllegalArgumentException("Address string cannot be null or blank");
        }
        // Simple parsing - in production, use more robust parsing
        String[] parts = fullAddress.split(",");
        if (parts.length >= 5) {
            return new Address(
                    parts[0].trim(),
                    parts[1].trim(),
                    parts[2].trim(),
                    parts[3].trim(),
                    parts[4].trim()
            );
        }
        throw new IllegalArgumentException("Invalid address format: " + fullAddress);
    }
}
