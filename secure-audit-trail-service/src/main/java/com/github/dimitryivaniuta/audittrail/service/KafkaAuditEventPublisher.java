package com.github.dimitryivaniuta.audittrail.service;

import com.github.dimitryivaniuta.audittrail.domain.AuditRecordEntity;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * Publishes appended audit records to Kafka.
 *
 * <p>Disabled by default. Enable with {@code audit.kafka.enabled=true}.</p>
 */
@Component("kafkaAuditEventPublisher")
@ConditionalOnProperty(prefix = "audit.kafka", name = "enabled", havingValue = "true")
public class KafkaAuditEventPublisher implements AuditEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String topic;

    /**
     * Creates the publisher.
     *
     * @param kafkaTemplate template
     * @param topic topic name
     */
    public KafkaAuditEventPublisher(
            KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${audit.kafka.topic:audit-records}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    @Override
    public void publishAppended(AuditRecordEntity record) {
        // Key by tenant so consumers can partition by tenant.
        kafkaTemplate.send(topic, record.getTenantId(), Map.of(
                "id", record.getId(),
                "tenantId", record.getTenantId(),
                "eventId", record.getEventId().toString(),
                "actor", record.getActor(),
                "action", record.getAction(),
                "resourceType", record.getResourceType(),
                "resourceId", record.getResourceId(),
                "correlationId", record.getCorrelationId(),
                "createdAt", record.getCreatedAt().toString(),
                "hashAlg", record.getHashAlg(),
                "keyId", record.getKeyId(),
                "prevHash", record.getPrevHash(),
                "hash", record.getHash()
        ));
    }
}
