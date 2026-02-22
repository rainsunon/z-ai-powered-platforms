package com.xrs.commonlib.outbox;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * OutboxService provides methods to save domain events to the outbox.
 * Used by aggregate roots to publish events transactionally.
 * Ensures atomicity between database changes and event storage.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxService {

    private final OutboxRepository outboxRepository;
    private final Gson gson = new Gson();

    /**
     * Save event to outbox (within same transaction as aggregate changes).
     * 
     * @param topic the message broker topic
     * @param eventKey the event key for partitioning
     * @param event the event object to serialize
     * @param aggregateId the aggregate ID
     * @param aggregateType the aggregate type
     * @return the saved outbox event
     */
    @Transactional
    public OutboxEvent saveEvent(String topic, String eventKey, Object event,
                                 String aggregateId, String aggregateType) {
        return saveEvent(topic, eventKey, event, aggregateId, aggregateType, null, null);
    }

    /**
     * Save event to outbox with correlation and causation IDs.
     * 
     * @param topic the message broker topic
     * @param eventKey the event key for partitioning
     * @param event the event object to serialize
     * @param aggregateId the aggregate ID
     * @param aggregateType the aggregate type
     * @param correlationId the correlation ID for tracing
     * @param causationId the causation ID for tracking causality
     * @return the saved outbox event
     */
    @Transactional
    public OutboxEvent saveEvent(String topic, String eventKey, Object event,
                                 String aggregateId, String aggregateType,
                                 String correlationId, String causationId) {
        try {
            String eventId = UUID.randomUUID().toString();
            String payload = gson.toJson(event);
            String eventType = event.getClass().getSimpleName();

            // Check for duplicate (idempotency)
            if (outboxRepository.existsByEventId(eventId)) {
                log.warn("Event {} already exists in outbox, skipping", eventId);
                return outboxRepository.findByEventId(eventId).orElse(null);
            }

            // Create a concrete implementation of OutboxEvent
            OutboxEvent outboxEvent = new OutboxEvent() {
                {
                    setEventId(eventId);
                    setTopic(topic);
                    setEventKey(eventKey);
                    setPayload(payload);
                    setEventType(eventType);
                    setAggregateId(aggregateId);
                    setAggregateType(aggregateType);
                    setCorrelationId(correlationId);
                    setCausationId(causationId);
                    setCreatedAt(java.time.LocalDateTime.now());
                    setPublished(false);
                    setRetryCount(0);
                }
            };

            OutboxEvent saved = outboxRepository.save(outboxEvent);
            log.debug("Saved event {} to outbox for topic {}", eventId, topic);
            return saved;
        } catch (Exception e) {
            log.error("Failed to save event to outbox: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save event to outbox", e);
        }
    }

    /**
     * Save multiple events to outbox (batch).
     * All events are saved in a single transaction.
     * 
     * @param topic the message broker topic
     * @param events the events to save
     * @param aggregateId the aggregate ID
     * @param aggregateType the aggregate type
     */
    @Transactional
    public void saveEvents(String topic, Object[] events, String aggregateId, String aggregateType) {
        for (Object event : events) {
            String eventKey = UUID.randomUUID().toString();
            saveEvent(topic, eventKey, event, aggregateId, aggregateType);
        }
    }

    /**
     * Save event with custom event ID (useful for idempotency across services).
     * 
     * @param eventId the custom event ID
     * @param topic the message broker topic
     * @param eventKey the event key for partitioning
     * @param event the event object to serialize
     * @param aggregateId the aggregate ID
     * @param aggregateType the aggregate type
     * @return the saved outbox event
     */
    @Transactional
    public OutboxEvent saveEventWithId(String eventId, String topic, String eventKey, Object event,
                                       String aggregateId, String aggregateType) {
        try {
            String payload = gson.toJson(event);
            String eventType = event.getClass().getSimpleName();

            // Check for duplicate (idempotency)
            if (outboxRepository.existsByEventId(eventId)) {
                log.warn("Event {} already exists in outbox, skipping", eventId);
                return outboxRepository.findByEventId(eventId).orElse(null);
            }

            // Create a concrete implementation of OutboxEvent
            OutboxEvent outboxEvent = new OutboxEvent() {
                {
                    setEventId(eventId);
                    setTopic(topic);
                    setEventKey(eventKey);
                    setPayload(payload);
                    setEventType(eventType);
                    setAggregateId(aggregateId);
                    setAggregateType(aggregateType);
                    setCreatedAt(java.time.LocalDateTime.now());
                    setPublished(false);
                    setRetryCount(0);
                }
            };

            OutboxEvent saved = outboxRepository.save(outboxEvent);
            log.debug("Saved event {} to outbox for topic {}", eventId, topic);
            return saved;
        } catch (Exception e) {
            log.error("Failed to save event to outbox: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save event to outbox", e);
        }
    }
}
