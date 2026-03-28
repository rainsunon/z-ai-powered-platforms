package com.github.dimitryivaniuta.gateway.outbox.config;

import java.time.Duration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration for outbox publishing behavior.
 */
@Data
@ConfigurationProperties(prefix = "outbox.publisher")
public class OutboxPublisherProperties {

    /**
     * Maximum number of outbox rows to claim in one publishing cycle.
     */
    private int batchSize = 50;

    /**
     * Max number of sending attempts before marking an outbox row as DEAD.
     */
    private int maxAttempts = 25;

    /**
     * How long a row stays LOCKED before it's considered stale and can be reclaimed.
     */
    private Duration lockTtl = Duration.ofSeconds(30);

    /**
     * Base delay for exponential backoff.
     */
    private Duration baseBackoff = Duration.ofSeconds(1);

    /**
     * Maximum backoff delay.
     */
    private Duration maxBackoff = Duration.ofMinutes(5);

    /**
     * Fixed delay between scheduler cycles.
     */
    private Duration fixedDelay = Duration.ofMillis(500);

    /**
     * Initial delay before the scheduler starts.
     */
    private Duration initialDelay = Duration.ofSeconds(2);

    /**
     * If true, a small reaper will periodically unlock stale LOCKED rows.
     */
    private boolean reaperEnabled = true;

    /**
     * How old a message must be to be considered "stuck" in PENDING/RETRY.
     */
    private Duration stuckOlderThan = Duration.ofMinutes(10);
}
