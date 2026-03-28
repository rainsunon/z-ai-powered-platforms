package com.github.dimitryivaniuta.gateway.outbox.model;

/**
 * Logical status of an outbox message.
 *
 * <p>Stored in DB as VARCHAR (no DB-level enum constraints) and mapped to this enum in application code.</p>
 */
public enum OutboxStatus {

    /** Ready to be published. */
    PENDING,

    /** Will be retried after {@code availableAt}. */
    RETRY,

    /** Claimed by a publisher instance for sending. */
    LOCKED,

    /** Successfully published to Kafka. */
    SENT,

    /** Permanently failed (attempts exceeded). */
    DEAD
}
