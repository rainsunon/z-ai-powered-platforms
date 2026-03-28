package com.github.dimitryivaniuta.gateway.outbox.publisher;

import com.github.dimitryivaniuta.gateway.outbox.config.OutboxPublisherProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduler that continuously publishes outbox rows to Kafka.
 */
@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class OutboxPublisherScheduler {

    private final OutboxPublisher publisher;
    private final OutboxPublisherProperties properties;

    /**
     * Periodically publishes eligible outbox rows.
     */
    @Scheduled(
            fixedDelayString = "${outbox.publisher.fixed-delay:500ms}",
            initialDelayString = "${outbox.publisher.initial-delay:2s}"
    )
    public void publish() {
        int sent = publisher.publishOnce();
        if (sent > 0) {
            log.info("Outbox published {} message(s)", sent);
        }
    }

    /**
     * Periodically unlocks stale LOCKED rows (e.g., after instance crash).
     */
    @Scheduled(
            fixedDelayString = "10s",
            initialDelayString = "10s"
    )
    public void reapLocks() {
        if (!properties.isReaperEnabled()) {
            return;
        }
        int unlocked = publisher.reapStaleLocks();
        if (unlocked > 0) {
            log.warn("Unlocked {} stale outbox lock(s)", unlocked);
        }
    }
}
