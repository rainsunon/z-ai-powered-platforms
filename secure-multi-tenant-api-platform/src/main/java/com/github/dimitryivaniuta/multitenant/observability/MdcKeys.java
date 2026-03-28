package com.github.dimitryivaniuta.multitenant.observability;

/**
 * MDC keys used across the application.
 */
public final class MdcKeys {

  /** Correlation id key. */
  public static final String CORRELATION_ID = "correlationId";

  /** Tenant id key. */
  public static final String TENANT_ID = "tenantId";

  private MdcKeys() {}
}
