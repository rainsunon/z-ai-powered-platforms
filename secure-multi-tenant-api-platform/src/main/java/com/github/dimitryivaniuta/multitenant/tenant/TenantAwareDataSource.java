package com.github.dimitryivaniuta.multitenant.tenant;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Objects;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.jdbc.datasource.AbstractDataSource;

/**
 * A {@link DataSource} decorator that applies the current tenant id to every JDBC transaction.
 *
 * <p>The decorator wraps borrowed {@link Connection}s with a dynamic proxy. When Spring starts a
 * transaction, it calls {@code connection.setAutoCommit(false)}. At that moment, the proxy executes:
 *
 * <pre>
 * select set_config('app.tenant_id', ?, true)
 * </pre>
 *
 * which sets the PostgreSQL session variable for the duration of the current transaction.
 *
 * <p>PostgreSQL Row Level Security (RLS) policies reference {@code current_setting('app.tenant_id', true)}
 * and therefore deny all reads/writes when the tenant id is missing.
 */
public final class TenantAwareDataSource extends AbstractDataSource {

  private static final String SET_TENANT_SQL = "select set_config('app.tenant_id', ?, true)";

  private final DataSource delegate;

  public TenantAwareDataSource(DataSource delegate) {
    this.delegate = Objects.requireNonNull(delegate, "delegate");
  }

  @Override
  public Connection getConnection() throws SQLException {
    return wrap(delegate.getConnection());
  }

  @Override
  public Connection getConnection(String username, String password) throws SQLException {
    return wrap(delegate.getConnection(username, password));
  }

  private static Connection wrap(Connection connection) {
    InvocationHandler handler = new TenantConnectionInvocationHandler(connection);
    return (Connection) Proxy.newProxyInstance(
        TenantAwareDataSource.class.getClassLoader(),
        new Class<?>[] {Connection.class},
        handler
    );
  }

  /**
   * Connection proxy that applies the tenant id when a JDBC transaction begins.
   */
  private static final class TenantConnectionInvocationHandler implements InvocationHandler {

    private final Connection delegate;
    private boolean tenantAppliedForCurrentTx = false;

    private TenantConnectionInvocationHandler(Connection delegate) {
      this.delegate = delegate;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
      String name = method.getName();

      // Apply tenant id at transaction begin (Spring sets autocommit=false).
      if ("setAutoCommit".equals(name) && args != null && args.length == 1 && args[0] instanceof Boolean b) {
        boolean autoCommit = b;
        Object result = method.invoke(delegate, args);
        if (!autoCommit) {
          applyTenantIfNeeded();
        } else {
          // Transaction ended; next transaction must re-apply.
          tenantAppliedForCurrentTx = false;
        }
        return result;
      }

      if ("commit".equals(name) || "rollback".equals(name)) {
        try {
          return method.invoke(delegate, args);
        } finally {
          tenantAppliedForCurrentTx = false;
        }
      }

      return method.invoke(delegate, args);
    }

    private void applyTenantIfNeeded() throws SQLException {
      if (tenantAppliedForCurrentTx) {
        return;
      }

      // Flyway and other non-request code paths may legitimately run without a tenant.
      // In those cases we skip setting the variable; tenant-scoped code is still protected
      // by RLS (and the service layer typically requires tenant context).
      UUID tenantId = TenantContext.getTenantId().orElse(null);
      if (tenantId == null) {
        return;
      }
      try (PreparedStatement ps = delegate.prepareStatement(SET_TENANT_SQL)) {
        ps.setString(1, tenantId.toString());
        ps.execute();
      }
      tenantAppliedForCurrentTx = true;
    }
  }
}
