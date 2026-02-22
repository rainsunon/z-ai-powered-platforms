package com.xrs.booking.auth.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Registration request. */
public record RegisterRequest(
    @Email @NotBlank String email,
    @NotBlank String password
) {}
