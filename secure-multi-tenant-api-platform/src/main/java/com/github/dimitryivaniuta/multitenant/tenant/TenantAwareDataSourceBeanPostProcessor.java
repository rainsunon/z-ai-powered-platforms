package com.github.dimitryivaniuta.multitenant.tenant;

import javax.sql.DataSource;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Wraps every {@link DataSource} bean with {@link TenantAwareDataSource}.
 *
 * <p><b>Why this exists:</b> relying on AOP ordering to ensure
 * {@code set_config('app.tenant_id', ...)} happens inside an active JDBC transaction is fragile.
 * This decorator applies the tenant id at the JDBC level when Spring begins a transaction
 * (i.e., when it calls {@code Connection#setAutoCommit(false)}).
 *
 * <p>This eliminates the class of “missing tenant filter” mistakes because the database itself
 * enforces isolation via RLS and the tenant id is injected for every transaction.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TenantAwareDataSourceBeanPostProcessor implements BeanPostProcessor {

  @Override
  public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
    if (bean instanceof DataSource ds && !(ds instanceof TenantAwareDataSource)) {
      return new TenantAwareDataSource(ds);
    }
    return bean;
  }
}
