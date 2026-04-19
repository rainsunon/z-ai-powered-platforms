package com.xrs.orderservice.service;

import com.xrs.orderservice.entity.OutboxEvent;
import com.xrs.orderservice.event.EventProducer;
import com.xrs.orderservice.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * OutboxPublisher service implements the transactional outbox pattern
 * Polls unpublished events from database and publishes them to Kafka
 * Ensures reliable event delivery with at-least-once semantics
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisher {

    private final OutboxEventRepository outboxEventRepository;
    private final EventProducer eventProducer;

    /**
     * Scheduled task to publish unpublished events
     * Runs every 5 seconds to ensure timely event delivery
     */
    @Scheduled(fixedDelay = 5000) // 5 seconds
    @Transactional
    public void publishPendingEvents() {
        try {
            List<OutboxEvent> unpublishedEvents = outboxEventRepository.findUnpublishedEventsForRetry();
            
            if (unpublishedEvents.isEmpty()) {
                return;
            }

            log.info("Publishing {} pending events from outbox", unpublishedEvents.size());

            for (OutboxEvent event : unpublishedEvents) {
                try {
                    publishEvent(event);
                } catch (Exception e) {
                    log.error("Failed to publish event {}: {}", event.getEventId(), e.getMessage(), e);
                    event.recordFailure(e.getMessage());
                    outboxEventRepository.save(event);
                }
            }
        } catch (Exception e) {
            log.error("Error in outbox publisher: {}", e.getMessage(), e);
        }
    }

    /**
     * Publish single event to Kafka
     */
    private void publishEvent(OutboxEvent event) {
        log.debug("Publishing event {} to topic {}", event.getEventId(), event.getTopic());

        // Publish to Kafka using EventProducer
        eventProducer.send(event.getTopic(), event.getEventKey(), event.getPayload())
                .doOnSuccess(result -> {
                    log.info("Successfully published event {} to topic {}", 
                            event.getEventId(), event.getTopic());
                    event.markAsPublished();
                    outboxEventRepository.save(event);
                })
                .doOnError(error -> {
                    log.error("Failed to publish event {} to Kafka: {}", 
                            event.getEventId(), error.getMessage());
                    event.recordFailure(error.getMessage());
                    outboxEventRepository.save(event);
                })
                .subscribe();
    }

    /**
     * Cleanup old published events (run daily)
     * Keeps last 7 days of published events for audit
     */
    @Scheduled(cron = "0 0 2 * * ?") // 2 AM daily
    @Transactional
    public void cleanupOldEvents() {
        try {
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(7);
            List<OutboxEvent> oldEvents = outboxEventRepository
                    .findByPublishedTrueAndPublishedAtBefore(cutoffDate);
            
            if (!oldEvents.isEmpty()) {
                log.info("Cleaning up {} old outbox events", oldEvents.size());
                outboxEventRepository.deleteAll(oldEvents);
            }
        } catch (Exception e) {
            log.error("Error cleaning up old events: {}", e.getMessage(), e);
        }
    }

    /**
     * Manually trigger publishing (for testing or manual intervention)
     */
    @Transactional
    public void triggerPublish() {
        log.info("Manually triggered outbox publishing");
        publishPendingEvents();
    }
}
