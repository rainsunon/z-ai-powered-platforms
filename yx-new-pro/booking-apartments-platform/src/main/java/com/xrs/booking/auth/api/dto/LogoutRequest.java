package com.xrs.booking.auth.api.dto;

/** Logout request. refreshToken is optional (best-effort session revoke). */
public record LogoutRequest(String refreshToken) {}
