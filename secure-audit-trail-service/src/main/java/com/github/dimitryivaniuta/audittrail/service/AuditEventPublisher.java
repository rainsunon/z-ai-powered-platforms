package com.github.dimitryivaniuta.audittrail.service;

import com.github.dimitryivaniuta.audittrail.domain.AuditRecordEntity;

/**
 * Optional integration hook to publish appended audit records to an external stream (Kafka, etc.).
 */
public interface AuditEventPublisher {

    /**
     * Publishes an appended audit record.
     *
     * @param record record
     */
    void publishAppended(AuditRecordEntity record);
}
