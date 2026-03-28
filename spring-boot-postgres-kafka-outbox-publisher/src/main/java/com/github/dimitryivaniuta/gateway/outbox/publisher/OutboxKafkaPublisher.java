package com.github.dimitryivaniuta.gateway.outbox.publisher;

import com.github.dimitryivaniuta.gateway.kafka.OutboxKafkaProperties;
import com.github.dimitryivaniuta.gateway.outbox.model.OutboxMessage;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.ExecutionException;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * Sends outbox messages to Kafka.
 *
 * <p>Publishing is implemented as synchronous send (waiting for broker ack),
 * so failures are observable and the outbox row can be retried reliably.</p>
 */
@Component
@RequiredArgsConstructor
public class OutboxKafkaPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final OutboxKafkaProperties kafkaProperties;

    /**
     * Publishes a single outbox message to Kafka.
     *
     * @param message outbox message
     * @param timeout maximum wait time for broker ack
     * @throws Exception if sending fails
     */
    public void publish(OutboxMessage message, Duration timeout) throws Exception {
        var record = new org.apache.kafka.clients.producer.ProducerRecord<>(
                kafkaProperties.getTopic(),
                message.aggregateId(),
                message.payloadJson()
        );

        // Useful metadata for consumers / observability.
        // Message key is set via ProducerRecord key (aggregateId) for stable partitioning.
        record.headers()
                .add(new RecordHeader("eventType", message.eventType().getBytes(StandardCharsets.UTF_8)))
                .add(new RecordHeader("outboxId", message.id().toString().getBytes(StandardCharsets.UTF_8)));

        try {
            kafkaTemplate.send(record).get(timeout.toMillis(), java.util.concurrent.TimeUnit.MILLISECONDS);
        } catch (ExecutionException e) {
            // Unwrap to preserve the real root cause.
            if (e.getCause() != null) {
                throw new Exception(e.getCause());
            }
            throw e;
        }
    }
}