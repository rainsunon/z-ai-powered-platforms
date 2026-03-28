package com.github.dimitryivaniuta.multitenant.tenant;

/**
 * Thrown when a tenant id is required but not present.
 */
public class MissingTenantException extends RuntimeException {

  public MissingTenantException(String message) {
    super(message);
  }
}
