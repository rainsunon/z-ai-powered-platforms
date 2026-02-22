package com.xrs.booking.auth.service;

/** Raised for invalid client input. */
public class AuthBadRequestException extends AuthException {
  public AuthBadRequestException(String message) { super(message); }
}
