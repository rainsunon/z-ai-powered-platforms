package com.github.dimitryivaniuta.multitenant.service;

/**
 * Thrown when a user is not found in the current tenant.
 */
public class UserNotFoundException extends RuntimeException {

  public UserNotFoundException(String message) {
    super(message);
  }
}
