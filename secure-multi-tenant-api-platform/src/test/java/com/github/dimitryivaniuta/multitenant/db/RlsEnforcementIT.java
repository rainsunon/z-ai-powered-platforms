package com.github.dimitryivaniuta.multitenant.db;

import com.github.dimitryivaniuta.multitenant.util.IntegrationTestBase;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Guardrail test that ensures tenant isolation is enforced at the database level for every
 * tenant-scoped table.
 *
 * <p>Definition of "tenant-scoped table": any table in schema {@code public} that has a {@code tenant_id}
 * column.
 *
 * <p>For each such table this test asserts:
 * <ul>
 *   <li>Row-Level Security is enabled</li>
 *   <li>FORCE Row-Level Security is enabled (prevents bypass by table owner)</li>
 *   <li>At least one policy exists</li>
 * </ul>
 */
public class RlsEnforcementIT extends IntegrationTestBase {

  @Autowired
  JdbcTemplate jdbc;

  @Test
  void everyTenantTable_hasRlsEnabledAndForced_andHasAtLeastOnePolicy() {
    List<String> tenantTables = jdbc.queryForList(
        """
        select c.table_name
        from information_schema.columns c
        where c.table_schema = 'public'
          and c.column_name = 'tenant_id'
        group by c.table_name
        order by c.table_name
        """,
        String.class
    );

    // If this fails, it likely means a migration renamed tenant_id or tables are created in another schema.
    assertThat(tenantTables).isNotEmpty();

    for (String table : tenantTables) {
      Map<String, Object> flags = jdbc.queryForMap(
          "select relrowsecurity, relforcerowsecurity from pg_class where relname = ?",
          table
      );

      assertThat((Boolean) flags.get("relrowsecurity"))
          .as(table + " must have RLS enabled")
          .isTrue();

      assertThat((Boolean) flags.get("relforcerowsecurity"))
          .as(table + " must have FORCE RLS enabled")
          .isTrue();

      Integer policies = jdbc.queryForObject(
          "select count(*) from pg_policies where schemaname = 'public' and tablename = ?",
          Integer.class,
          table
      );

      assertThat(policies)
          .as(table + " must have at least one RLS policy")
          .isNotNull()
          .isGreaterThanOrEqualTo(1);
    }
  }
}
