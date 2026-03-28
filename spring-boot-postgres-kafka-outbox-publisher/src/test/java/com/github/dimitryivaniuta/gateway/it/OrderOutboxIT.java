package com.github.dimitryivaniuta.gateway.it;

import com.github.dimitryivaniuta.gateway.kafka.OutboxKafkaProperties;
import com.github.dimitryivaniuta.gateway.outbox.publisher.OutboxPublisher;
import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests verifying business write + outbox write + eventual publish.
 */
public class OrderOutboxIT extends IntegrationTestBase {

    @Autowired
    TestRestTemplate restTemplate;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    OutboxPublisher outboxPublisher;

    @Autowired
    OutboxKafkaProperties kafkaProperties;

    @Autowired
    Environment environment;

    @Test
    void shouldWriteBusinessAndOutboxInOneTransaction_andEventuallyPublishToKafka() {
        var reqBody = """
                {
                  "customerEmail": "john.doe@example.com",
                  "totalAmount": 123.45
                }
                """;

        var req = RequestEntity
                .post("/api/orders")
                .header("Content-Type", "application/json")
                .body(reqBody);

        var resp = restTemplate.exchange(req, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(resp.getBody()).contains("\"status\":\"CREATED\"");

        // There should be exactly one outbox row created for this request (scheduler disabled).
        Integer outboxCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM outbox_messages", Integer.class);
        assertThat(outboxCount).isEqualTo(1);

        String status = jdbcTemplate.queryForObject("SELECT status FROM outbox_messages LIMIT 1", String.class);
        assertThat(status).isEqualTo("PENDING");

        // Manually publish.
        int sent = outboxPublisher.publishOnce();
        assertThat(sent).isEqualTo(1);

        // Verify Kafka record exists.
        String bootstrap = environment.getProperty("spring.kafka.bootstrap-servers");
        assertThat(bootstrap).isNotBlank();

        try (KafkaTestConsumer consumer = new KafkaTestConsumer(bootstrap, kafkaProperties.getTopic())) {
            List<ConsumerRecord<String, String>> records = consumer.pollFor(1, Duration.ofSeconds(10));
            assertThat(records).hasSize(1);
            assertThat(records.get(0).value()).contains("\"customerEmail\":\"john.doe@example.com\"");
        }

        // Outbox row should be SENT.
        String statusAfter = jdbcTemplate.queryForObject("SELECT status FROM outbox_messages LIMIT 1", String.class);
        assertThat(statusAfter).isEqualTo("SENT");
    }
}
