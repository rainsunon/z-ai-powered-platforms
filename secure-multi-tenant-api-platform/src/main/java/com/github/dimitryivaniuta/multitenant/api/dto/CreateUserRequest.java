package com.github.dimitryivaniuta.multitenant.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request payload to create a user in the current tenant.
 */
public record CreateUserRequest(
    @NotBlank @Email String email,
    @NotBlank String fullName
) {
}
