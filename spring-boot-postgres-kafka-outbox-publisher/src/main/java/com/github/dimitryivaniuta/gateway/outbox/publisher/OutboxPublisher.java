package com.github.dimitryivaniuta.gateway.outbox.publisher;

import com.github.dimitryivaniuta.gateway.outbox.OutboxRepository;
import com.github.dimitryivaniuta.gateway.outbox.config.OutboxPublisherProperties;
import com.github.dimitryivaniuta.gateway.outbox.model.OutboxMessage;
import com.github.dimitryivaniuta.gateway.util.Backoff;
import java.time.Clock;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Core outbox publisher.
 *
 * <p>Algorithm:
 * <ol>
 *   <li>Atomically claim rows using {@code FOR UPDATE SKIP LOCKED} (cluster-safe).</li>
 *   <li>For each claimed row, send to Kafka (sync wait for ack).</li>
 *   <li>On success: mark row SENT.</li>
 *   <li>On failure: mark row RETRY with exponential backoff; after maxAttempts => DEAD.</li>
 * </ol>
 * </p>
 *
 * <p>Note: this provides <b>at-least-once delivery</b> to Kafka.
 * Consumers must handle duplicates using the {@code outboxId} header if strict de-dup is required.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxPublisher {

    private final OutboxRepository outboxRepository;
    private final OutboxKafkaPublisher kafkaPublisher;
    private final OutboxPublisherProperties properties;
    private final Clock clock;
    private final String instanceId;

    private static final Duration SEND_TIMEOUT = Duration.ofSeconds(5);

    /**
     * Performs a single publishing cycle.
     *
     * <p>Made public to be callable from tests and schedulers.</p>
     *
     * @return number of rows successfully marked as SENT in this cycle
     */
    public int publishOnce() {
        List<OutboxMessage> batch = outboxRepository.claimBatch(
                properties.getBatchSize(),
                instanceId,
                properties.getLockTtl()
        );

        if (batch.isEmpty()) {
            return 0;
        }

        int sent = 0;
        for (OutboxMessage msg : batch) {
            try {
                kafkaPublisher.publish(msg, SEND_TIMEOUT);
                int updated = outboxRepository.markSent(msg.id(), instanceId);
                if (updated == 1) {
                    sent++;
                } else {
                    log.warn("Lost lock before marking SENT, outboxId={}", msg.id());
                }
            } catch (Exception e) {
                handleFailure(msg, e);
            }
        }

        return sent;
    }

    private void handleFailure(OutboxMessage msg, Exception e) {
        int attemptZeroBased = msg.attempts(); // next attempt will be attempts+1
        Duration delay = Backoff.fullJitter(attemptZeroBased, properties.getBaseBackoff(), properties.getMaxBackoff());
        OffsetDateTime next = OffsetDateTime.now(clock).plus(delay);
        String err = truncate(e.toString(), 2000);

        int updated = outboxRepository.markFailed(
                msg.id(),
                instanceId,
                properties.getMaxAttempts(),
                next,
                err
        );

        if (updated != 1) {
            log.warn("Lost lock before marking FAILED, outboxId={}, error={}", msg.id(), e.toString());
        } else {
            log.warn("Outbox publish failed, will retry. outboxId={}, attempt={}, nextInMs={}, error={}",
                    msg.id(), msg.attempts() + 1, delay.toMillis(), e.toString());
        }
    }

    /**
     * Unlocks stale LOCKED rows.
     *
     * <p>Runs in a transaction to ensure consistent updates.</p>
     *
     * @return number of rows unlocked
     */
    @Transactional
    public int reapStaleLocks() {
        return outboxRepository.unlockStaleLocks();
    }

    private static String truncate(String s, int maxLen) {
        if (s == null) return null;
        if (s.length() <= maxLen) return s;
        return s.substring(0, maxLen);
    }
}
