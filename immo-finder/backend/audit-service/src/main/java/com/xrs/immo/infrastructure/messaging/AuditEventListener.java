package com.xrs.immo.infrastructure.messaging;

import com.xrs.immo.domain.model.AuditLog;
import com.xrs.immo.domain.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditEventListener {

    private final AuditLogRepository repository;

    @KafkaListener(topics = {"buy-property-events", "rent-property-events"}, groupId = "audit-service-group")
    public void handleEvent(@Payload String payload, 
                            @Header(KafkaHeaders.RECEIVED_KEY) String key,
                            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        
        // Use a combination of topic and key as a simple idempotent ID
        // In a real scenario, the event should have a unique eventId
        String eventId = topic + "-" + key;
        
        if (repository.existsById(eventId)) {
            log.info("Event {} already processed. Skipping.", eventId);
            return;
        }

        try {
            AuditLog auditLog = AuditLog.builder()
                    .id(eventId)
                    .eventType(topic)
                    .aggregateId(key)
                    .payload(payload)
                    .processedAt(LocalDateTime.now())
                    .build();
            
            repository.save(auditLog);
            log.info("Audit log saved for event {}", eventId);
        } catch (Exception e) {
            log.error("Failed to process audit event", e);
        }
    }
}
