package com.github.dimitryivaniuta.multitenant.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Enables annotation-driven transaction management.
 *
 * <p>Tenant isolation is enforced at the database level via PostgreSQL Row-Level Security (RLS).
 * The tenant id is applied to each JDBC transaction by a tenant-aware DataSource wrapper
 * (see {@code com.github.dimitryivaniuta.multitenant.tenant.TenantAwareDataSourceBeanPostProcessor}).
 */
@Configuration
@EnableTransactionManagement
public class TransactionConfig {}
