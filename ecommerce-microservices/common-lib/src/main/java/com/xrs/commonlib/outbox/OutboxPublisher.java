package com.xrs.commonlib.outbox;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * OutboxPublisher service implements the transactional outbox pattern.
 * Polls unpublished events from database and publishes them to message broker.
 * Ensures reliable event delivery with at-least-once semantics.
 * 
 * This is an abstract base class that services should extend to provide
 * the actual message broker publishing logic.
 */
@Service
@Slf4j
public abstract class OutboxPublisher {

    private final OutboxRepository outboxRepository;
    
    @Value("${outbox.max-retries:3}")
    private int maxRetries;
    
    @Value("${outbox.batch-size:100}")
    private int batchSize;
    
    private final Sinks.Many<OutboxEvent> eventSink = Sinks.many().multicast().onBackpressureBuffer();
    private final AtomicInteger publishedCount = new AtomicInteger(0);
    private final AtomicInteger failedCount = new AtomicInteger(0);

    protected OutboxPublisher(OutboxRepository outboxRepository) {
        this.outboxRepository = outboxRepository;
        startEventProcessor();
    }

    /**
     * Scheduled task to publish unpublished events.
     * Runs every 5 seconds by default to ensure timely event delivery.
     */
    @Scheduled(fixedDelayString = "${outbox.poll-interval:5000}")
    @Transactional
    public void publishPendingEvents() {
        try {
            List<OutboxEvent> unpublishedEvents = outboxRepository.findUnpublishedEventsBelowRetryThreshold(maxRetries);
            
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
                    outboxRepository.save(event);
                    failedCount.incrementAndGet();
                }
            }
            
            log.info("Published {} events successfully, {} failed", 
                    publishedCount.getAndSet(0), failedCount.getAndSet(0));
        } catch (Exception e) {
            log.error("Error in outbox publisher: {}", e.getMessage(), e);
        }
    }

    /**
     * Publish single event to message broker.
     * Subclasses must implement the actual publishing logic.
     * 
     * @param event the outbox event to publish
     */
    protected void publishEvent(OutboxEvent event) {
        log.debug("Publishing event {} to topic {}", event.getEventId(), event.getTopic());

        // Call the abstract method to publish to the actual message broker
        publishToBroker(event.getTopic(), event.getEventKey(), event.getPayload())
                .doOnSuccess(result -> {
                    log.info("Successfully published event {} to topic {}", 
                            event.getEventId(), event.getTopic());
                    event.markAsPublished();
                    outboxRepository.save(event);
                    publishedCount.incrementAndGet();
                    eventSink.tryEmitNext(event);
                })
                .doOnError(error -> {
                    log.error("Failed to publish event {} to message broker: {}", 
                            event.getEventId(), error.getMessage());
                    event.recordFailure(error.getMessage());
                    outboxRepository.save(event);
                    failedCount.incrementAndGet();
                })
                .subscribe();
    }

    /**
     * Abstract method to publish to the actual message broker.
     * Subclasses must implement this to provide the broker-specific logic.
     * 
     * @param topic the topic to publish to
     * @param key the event key
     * @param payload the event payload
     * @return a Mono that completes when the event is published
     */
    protected abstract Mono<Void> publishToBroker(String topic, String key, String payload);

    /**
     * Cleanup old published events (run daily).
     * Keeps last 7 days of published events for audit by default.
     */
    @Scheduled(cron = "${outbox.cleanup-cron:0 0 2 * * ?}") // 2 AM daily
    @Transactional
    public void cleanupOldEvents() {
        try {
            int retentionDays = getRetentionDays();
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(retentionDays);
            int deleted = outboxRepository.deletePublishedEventsOlderThan(cutoffDate);
            
            if (deleted > 0) {
                log.info("Cleaned up {} old outbox events", deleted);
            }
        } catch (Exception e) {
            log.error("Error cleaning up old events: {}", e.getMessage(), e);
        }
    }

    /**
     * Get the retention period for published events.
     * Override in subclasses to customize.
     * 
     * @return number of days to retain published events
     */
    protected int getRetentionDays() {
        return 7;
    }

    /**
     * Manually trigger publishing (for testing or manual intervention).
     */
    @Transactional
    public void triggerPublish() {
        log.info("Manually triggered outbox publishing");
        publishPendingEvents();
    }

    /**
     * Start the event processor for reactive event handling.
     */
    private void startEventProcessor() {
        eventSink.asFlux()
                .publishOn(Schedulers.boundedElastic())
                .subscribe(
                        event -> log.debug("Event {} processed successfully", event.getEventId()),
                        error -> log.error("Error in event processor: {}", error.getMessage()),
                        () -> log.debug("Event processor completed")
                );
    }

    /**
     * Get statistics about the outbox.
     * 
     * @return outbox statistics
     */
    public OutboxStats getStats() {
        long unpublishedCount = outboxRepository.countByPublishedFalse();
        return new OutboxStats(unpublishedCount, publishedCount.get(), failedCount.get());
    }

    /**
     * Statistics holder for outbox monitoring.
     */
    public record OutboxStats(long unpublishedCount, int publishedCount, int failedCount) {}
}
