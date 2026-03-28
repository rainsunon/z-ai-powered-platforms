package com.github.dimitryivaniuta.audittrail;

import com.github.dimitryivaniuta.audittrail.service.AuditRecordService;
import com.github.dimitryivaniuta.audittrail.service.VerificationResult;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.*;

/**
 * Integration tests for append-only + tamper-evident behavior.
 */
@SpringBootTest
class AuditRecordServiceIT extends PostgresTestBase {

    @Autowired
    private AuditRecordService service;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void append_creates_valid_hash_chain() {
        var r1 = service.append(new AuditRecordService.AppendAuditRecordRequest(
                "tenantA",
                UUID.randomUUID(),
                "alice",
                "ORDER_CREATED",
                "ORDER",
                "order-1",
                "corr-1",
                Map.of("amount", 10, "currency", "PLN")
        ));

        var r2 = service.append(new AuditRecordService.AppendAuditRecordRequest(
                "tenantA",
                UUID.randomUUID(),
                "bob",
                "ORDER_PAID",
                "ORDER",
                "order-1",
                "corr-2",
                Map.of("paid", true)
        ));

        assertThat(r2.getPrevHash()).isEqualTo(r1.getHash());

        VerificationResult vr = service.verify("tenantA", null, null);
        assertThat(vr.ok()).isTrue();
        assertThat(vr.recordsChecked()).isEqualTo(2);
    }

    @Test
    void update_is_rejected_by_db_trigger() {
        var r1 = service.append(new AuditRecordService.AppendAuditRecordRequest(
                "tenantB",
                UUID.randomUUID(),
                "svc",
                "ROLE_ASSIGNED",
                "USER",
                "user-1",
                null,
                Map.of("role", "ADMIN")
        ));

        assertThatThrownBy(() ->
                jdbc.update("UPDATE audit_records SET actor = 'mallory' WHERE id = ?", r1.getId())
        ).isInstanceOf(Exception.class);
    }

    @Test
    void tampering_is_detectable_by_verifier() {
        var r1 = service.append(new AuditRecordService.AppendAuditRecordRequest(
                "tenantC",
                UUID.randomUUID(),
                "svc",
                "CONFIG_CHANGED",
                "SYSTEM",
                "cfg",
                null,
                Map.of("flag", true)
        ));

        var r2 = service.append(new AuditRecordService.AppendAuditRecordRequest(
                "tenantC",
                UUID.randomUUID(),
                "svc",
                "CONFIG_CHANGED",
                "SYSTEM",
                "cfg",
                null,
                Map.of("flag", false)
        ));

        // Simulate privileged tampering by dropping the immutability trigger, modifying data, and re-creating the trigger.
        jdbc.execute("DROP TRIGGER IF EXISTS trg_audit_records_reject_mutation ON audit_records");
        jdbc.update("UPDATE audit_records SET data = '{\"flag\": \"TAMPERED\"}'::jsonb WHERE id = ?", r1.getId());
        jdbc.execute("""
            CREATE TRIGGER trg_audit_records_reject_mutation
            BEFORE UPDATE OR DELETE ON audit_records
            FOR EACH ROW
            EXECUTE FUNCTION audit_records_reject_mutation();
        """);

        VerificationResult vr = service.verify("tenantC", null, null);
        assertThat(vr.ok()).isFalse();
        assertThat(vr.firstMismatchId()).isEqualTo(r1.getId());
    }
}
