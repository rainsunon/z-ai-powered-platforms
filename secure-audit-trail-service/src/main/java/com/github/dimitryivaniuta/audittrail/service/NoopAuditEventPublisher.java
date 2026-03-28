package com.github.dimitryivaniuta.audittrail.service;

import com.github.dimitryivaniuta.audittrail.domain.AuditRecordEntity;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

/**
 * Default publisher that does nothing.
 */
@Component
@ConditionalOnMissingBean(name = "kafkaAuditEventPublisher")
public class NoopAuditEventPublisher implements AuditEventPublisher {

    @Override
    public void publishAppended(AuditRecordEntity record) {
        // no-op
    }
}
