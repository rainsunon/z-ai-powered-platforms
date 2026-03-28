package com.github.dimitryivaniuta.gateway.it;

import com.github.dimitryivaniuta.gateway.kafka.OutboxKafkaProperties;
import com.github.dimitryivaniuta.gateway.outbox.OutboxRepository;
import com.github.dimitryivaniuta.gateway.outbox.OutboxWriter;
import com.github.dimitryivaniuta.gateway.outbox.config.OutboxPublisherProperties;
import com.github.dimitryivaniuta.gateway.outbox.publisher.OutboxKafkaPublisher;
import com.github.dimitryivaniuta.gateway.outbox.publisher.OutboxPublisher;
import java.time.Clock;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.header.Header;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test verifying that multiple publisher instances do not double-publish the same outbox rows.
 */
public class MultiInstanceNoDuplicatePublishingIT extends IntegrationTestBase {

    @Autowired
    OutboxRepository outboxRepository;

    @Autowired
    OutboxKafkaPublisher kafkaPublisher;

    @Autowired
    OutboxPublisherProperties properties;

    @Autowired
    Clock clock;

    @Autowired
    OutboxWriter outboxWriter;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    OutboxKafkaProperties kafkaProperties;

    @Autowired
    Environment environment;

    @Test
    void shouldNotDuplicatePublishingAcrossInstances() throws Exception {
        int n = 25;

        // Create N outbox rows.
        for (int i = 0; i < n; i++) {
            outboxWriter.write("OrderCreated", "order-" + i, Map.of("orderId", UUID.randomUUID(), "i", i));
        }

        OutboxPublisher p1 = new OutboxPublisher(outboxRepository, kafkaPublisher, properties, clock, "instance-1");
        OutboxPublisher p2 = new OutboxPublisher(outboxRepository, kafkaPublisher, properties, clock, "instance-2");

        ExecutorService es = Executors.newFixedThreadPool(2);

        Callable<Integer> runPublisher = () -> {
            int total = 0;
            for (int i = 0; i < 20; i++) { // enough cycles for small batch sizes
                total += p1.publishOnce();
                if (remainingToPublish() == 0) break;
            }
            return total;
        };

        Callable<Integer> runPublisher2 = () -> {
            int total = 0;
            for (int i = 0; i < 20; i++) {
                total += p2.publishOnce();
                if (remainingToPublish() == 0) break;
            }
            return total;
        };

        Future<Integer> f1 = es.submit(runPublisher);
        Future<Integer> f2 = es.submit(runPublisher2);

        int sent1 = f1.get(30, TimeUnit.SECONDS);
        int sent2 = f2.get(30, TimeUnit.SECONDS);

        es.shutdownNow();

        assertThat(sent1 + sent2).isEqualTo(n);
        assertThat(remainingToPublish()).isEqualTo(0);

        Integer sentCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM outbox_messages WHERE status='SENT'", Integer.class);
        assertThat(sentCount).isEqualTo(n);

        // Consume N messages and verify unique outboxId headers.
        String bootstrap = environment.getProperty("spring.kafka.bootstrap-servers");
        try (KafkaTestConsumer consumer = new KafkaTestConsumer(bootstrap, kafkaProperties.getTopic())) {
            List<ConsumerRecord<String, String>> records = consumer.pollFor(n, Duration.ofSeconds(15));
            assertThat(records).hasSize(n);

            Set<String> outboxIds = new HashSet<>();
            for (ConsumerRecord<String, String> r : records) {
                Header h = r.headers().lastHeader("outboxId");
                assertThat(h).isNotNull();
                outboxIds.add(new String(h.value()));
            }
            assertThat(outboxIds).hasSize(n);
        }
    }

    private int remainingToPublish() {
        Integer cnt = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM outbox_messages WHERE status IN ('PENDING','RETRY','LOCKED')",
                Integer.class
        );
        return cnt == null ? 0 : cnt;
    }
}
