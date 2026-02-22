package com.xrs.booking.auth.service;

/** Raised when authentication is required or token is invalid. */
public class AuthUnauthorizedException extends AuthException {
  public AuthUnauthorizedException(String message) { super(message); }
}
