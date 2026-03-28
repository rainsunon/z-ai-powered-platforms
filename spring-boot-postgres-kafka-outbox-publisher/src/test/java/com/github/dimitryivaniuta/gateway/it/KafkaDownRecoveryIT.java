package com.github.dimitryivaniuta.gateway.it;

import com.github.dimitryivaniuta.gateway.kafka.OutboxKafkaProperties;
import com.github.dimitryivaniuta.gateway.outbox.OutboxWriter;
import com.github.dimitryivaniuta.gateway.outbox.publisher.OutboxKafkaPublisher;
import com.github.dimitryivaniuta.gateway.outbox.publisher.OutboxPublisher;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

/**
 * Integration test that simulates Kafka outage by forcing the publisher to throw once.
 */
public class KafkaDownRecoveryIT extends IntegrationTestBase {

    @Autowired
    OutboxWriter outboxWriter;

    @Autowired
    OutboxPublisher outboxPublisher;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    OutboxKafkaProperties kafkaProperties;

    @Autowired
    Environment environment;

    @SpyBean
    OutboxKafkaPublisher kafkaPublisherSpy;

    @Test
    void ifKafkaIsDown_eventRemainsInDbAndIsPublishedLater() {
        outboxWriter.write("OrderCreated", "order-1", Map.of("orderId", "order-1"));

        // Force first publish attempt to fail (simulate broker down).
        Mockito.doThrow(new RuntimeException("Kafka is down"))
                .doCallRealMethod()
                .when(kafkaPublisherSpy).publish(any(), any(Duration.class));

        int sent1 = outboxPublisher.publishOnce();
        assertThat(sent1).isEqualTo(0);

        String statusAfterFail = jdbcTemplate.queryForObject("SELECT status FROM outbox_messages LIMIT 1", String.class);
        assertThat(statusAfterFail).isIn("RETRY", "DEAD"); // DEAD if maxAttempts=1 in local overrides, but default is RETRY.

        // Second cycle should succeed.
        int sent2 = outboxPublisher.publishOnce();
        assertThat(sent2).isEqualTo(1);

        String statusAfterOk = jdbcTemplate.queryForObject("SELECT status FROM outbox_messages LIMIT 1", String.class);
        assertThat(statusAfterOk).isEqualTo("SENT");

        // Verify Kafka record exists.
        String bootstrap = environment.getProperty("spring.kafka.bootstrap-servers");
        try (KafkaTestConsumer consumer = new KafkaTestConsumer(bootstrap, kafkaProperties.getTopic())) {
            List<ConsumerRecord<String, String>> records = consumer.pollFor(1, Duration.ofSeconds(10));
            assertThat(records).hasSize(1);
        }
    }
}
