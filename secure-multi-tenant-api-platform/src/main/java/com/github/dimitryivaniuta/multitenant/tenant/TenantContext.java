package com.github.dimitryivaniuta.multitenant.tenant;

import java.util.Optional;
import java.util.UUID;

/**
 * Thread-local holder for the current tenant.
 *
 * <p>Populated for each incoming HTTP request (from the JWT claim {@code tenantId}) and cleared
 * at the end of the request.
 */
public final class TenantContext {

  private static final ThreadLocal<UUID> CURRENT = new ThreadLocal<>();

  private TenantContext() {
  }

  /** Sets the current tenant id for the running thread. */
  public static void setTenantId(UUID tenantId) {
    CURRENT.set(tenantId);
  }

  /** Clears the current tenant id for the running thread. */
  public static void clear() {
    CURRENT.remove();
  }

  /** Returns the current tenant id, if present. */
  public static Optional<UUID> getTenantId() {
    return Optional.ofNullable(CURRENT.get());
  }

  /** Returns the current tenant id or throws if missing. */
  public static UUID requireTenantId() {
    UUID tenantId = CURRENT.get();
    if (tenantId == null) {
      throw new MissingTenantException("Missing tenant context");
    }
    return tenantId;
  }
}
