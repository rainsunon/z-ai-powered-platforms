package com.xrs.orderservice.service;

import com.google.gson.Gson;
import com.xrs.orderservice.entity.OutboxEvent;
import com.xrs.orderservice.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * OutboxService provides methods to save domain events to the outbox
 * Used by aggregate roots to publish events transactionally
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxService {

    private final OutboxEventRepository outboxEventRepository;
    private final Gson gson = new Gson();

    /**
     * Save event to outbox (within same transaction as aggregate changes)
     */
    @Transactional
    public void saveEvent(String topic, String eventKey, Object event, 
                         String aggregateId, String aggregateType) {
        try {
            String eventId = UUID.randomUUID().toString();
            String payload = gson.toJson(event);
            String eventType = event.getClass().getSimpleName();

            // Check for duplicate (idempotency)
            if (outboxEventRepository.existsByEventId(eventId)) {
                log.warn("Event {} already exists in outbox, skipping", eventId);
                return;
            }

            OutboxEvent outboxEvent = OutboxEvent.create(
                    eventId,
                    topic,
                    eventKey,
                    payload,
                    eventType,
                    aggregateId,
                    aggregateType
            );

            outboxEventRepository.save(outboxEvent);
            log.debug("Saved event {} to outbox for topic {}", eventId, topic);
        } catch (Exception e) {
            log.error("Failed to save event to outbox: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save event to outbox", e);
        }
    }

    /**
     * Save multiple events to outbox (batch)
     */
    @Transactional
    public void saveEvents(String topic, Object... events) {
        for (Object event : events) {
            String eventKey = UUID.randomUUID().toString();
            saveEvent(topic, eventKey, event, eventKey, "Order");
        }
    }
}
