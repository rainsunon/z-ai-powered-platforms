package com.xrs.booking.auth.api.dto;

/** Token pair response. */
public record TokenResponse(
    String accessToken,
    String refreshToken,
    long accessTokenExpiresInSeconds
) {}
