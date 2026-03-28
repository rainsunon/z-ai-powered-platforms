package com.github.dimitryivaniuta.audittrail.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Per-tenant chain head used to serialize appends in a scalable way.
 *
 * <p>Instead of locking the "last audit record" row (which becomes expensive with large tables),
 * the service locks a single small row per tenant and updates it on each append.</p>
 *
 * <p>This row stores the last known {@code seq} and {@code hash} for the tenant chain.</p>
 */
@Entity
@Table(name = "audit_chain_heads")
@Getter
@Setter
@NoArgsConstructor
public class AuditChainHeadEntity {

    /** Tenant id (primary key). */
    @Id
    @Column(name = "tenant_id", nullable = false, length = 64)
    private String tenantId;

    /** Last sequence number appended for this tenant. */
    @Column(name = "last_seq", nullable = false)
    private long lastSeq;

    /** Hash of the last appended record (or null for an empty chain). */
    @Column(name = "last_hash", length = 128)
    private String lastHash;

    /** Id of the last appended audit record (optional, informational). */
    @Column(name = "last_record_id")
    private Long lastRecordId;

    /** Last update timestamp. */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
