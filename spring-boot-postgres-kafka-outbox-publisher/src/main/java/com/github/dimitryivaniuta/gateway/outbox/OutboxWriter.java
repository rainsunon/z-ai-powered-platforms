package com.github.dimitryivaniuta.gateway.outbox;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dimitryivaniuta.gateway.outbox.model.OutboxStatus;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Writes messages to the outbox table.
 *
 * <p>Must be invoked within the same DB transaction as the business changes.</p>
 */
@Component
@RequiredArgsConstructor
public class OutboxWriter {

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    /**
     * Stores a domain event in the outbox table.
     *
     * @param eventType logical event type (e.g., {@code OrderCreated})
     * @param aggregateId aggregate identifier (as string)
     * @param payload event payload (will be serialized to JSON)
     * @return generated outbox message id
     */
    public UUID write(String eventType, String aggregateId, Object payload) {
        UUID id = UUID.randomUUID();
        String json = toJson(payload);
        OffsetDateTime now = OffsetDateTime.now(clock);

        jdbcTemplate.update("""
                INSERT INTO outbox_messages(
                    id, event_type, aggregate_id, payload, status,
                    created_at, available_at, attempts
                ) VALUES (?, ?, ?, ?::jsonb, ?, ?, ?, 0)
                """,
                id,
                eventType,
                aggregateId,
                json,
                OutboxStatus.PENDING.name(),
                now,
                now
        );

        return id;
    }

    private String toJson(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Failed to serialize outbox payload to JSON", e);
        }
    }
}
