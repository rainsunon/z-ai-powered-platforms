package com.github.dimitryivaniuta.multitenant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Secure Multi-tenant API Platform.
 *
 * <p>Tenant isolation is enforced using two layers:
 * <ul>
 *   <li><b>Request-level tenant context</b>: each request extracts {@code tenantId} from a JWT claim.</li>
 *   <li><b>Database-level Row Level Security (RLS)</b>: every row is filtered by the current tenant
 *   stored in a PostgreSQL session setting.</li>
 * </ul>
 *
 * <p>This design prevents "missing tenant filter" mistakes because even if a developer forgets
 * to add {@code WHERE tenant_id = ?}, PostgreSQL RLS blocks cross-tenant reads/updates.
 */
@SpringBootApplication
public class SecureMultiTenantApiPlatformApplication {

  public static void main(String[] args) {
    SpringApplication.run(SecureMultiTenantApiPlatformApplication.class, args);
  }
}
