package com.xrs.inventoryservice.event;

import com.google.gson.Gson;
import com.xrs.commonlib.outbox.OutboxEvent;
import com.xrs.commonlib.outbox.OutboxPublisher;
import com.xrs.inventoryservice.entity.InventoryOutboxEvent;
import com.xrs.inventoryservice.repository.InventoryOutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Outbox publisher for inventory service.
 * Extends the abstract OutboxPublisher from common-lib.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryOutboxPublisher extends OutboxPublisher<InventoryOutboxEvent> {
    
    private final InventoryOutboxEventRepository repository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final Gson gson = new Gson();
    
    @Override
    protected InventoryOutboxEvent createOutboxEvent(String topic, String aggregateId, Object payload, 
                                                    String correlationId, String aggregateType) {
        return new InventoryOutboxEvent(topic, aggregateId, payload, correlationId, aggregateType);
    }
    
    @Override
    protected InventoryOutboxEvent saveEvent(InventoryOutboxEvent event) {
        return repository.save(event);
    }
    
    @Override
    protected void publishToBroker(String topic, String key, String payload) {
        kafkaTemplate.send(topic, key, payload)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send event to Kafka topic {}: {}", topic, ex.getMessage());
                    } else {
                        log.info("Successfully sent event to Kafka topic {}: {}", topic, result.getRecordMetadata().offset());
                    }
                });
    }
    
    @Override
    protected void markAsPublished(InventoryOutboxEvent event) {
        event.setPublished(true);
        event.setPublishedAt(LocalDateTime.now());
        repository.save(event);
    }
    
    @Override
    protected void incrementRetryCount(InventoryOutboxEvent event) {
        event.setRetryCount(event.getRetryCount() + 1);
        repository.save(event);
    }
    
    @Override
    protected void setErrorMessage(InventoryOutboxEvent event, String errorMessage) {
        event.setErrorMessage(errorMessage);
        repository.save(event);
    }
    
    @Override
    protected void deleteOldEvents(LocalDateTime cutoffDate) {
        repository.deleteOldPublishedEvents(cutoffDate);
    }
    
    @Override
    protected Gson getGson() {
        return gson;
    }
}
