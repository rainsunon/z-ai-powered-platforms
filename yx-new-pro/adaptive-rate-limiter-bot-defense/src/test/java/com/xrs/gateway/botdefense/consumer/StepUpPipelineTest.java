package com.xrs.gateway.botdefense.consumer;

import com.xrs.gateway.botdefense.kafka.BotDefenseEvent;
import com.xrs.gateway.botdefense.kafka.CaptchaStepUpDlqEvent;
import com.xrs.gateway.botdefense.kafka.SecurityActionRequest;
import com.squareup.okhttp3.mockwebserver.MockResponse;
import com.squareup.okhttp3.mockwebserver.MockWebServer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.utility.DockerImageName;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(
        classes = StepUpConsumerApplication.class,
        properties = {
                // other props are supplied via DynamicPropertySource
        }
)
class StepUpPipelineTest {

    private static final KafkaContainer KAFKA;
    private static final GenericContainer<?> REDIS;
    private static final MockWebServer MOCK_WEB;

    static {
        try {
            // Confluent image is the officially supported default for KafkaContainer.
            KAFKA = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.1"));
            KAFKA.start();

            REDIS = new GenericContainer<>(DockerImageName.parse("redis:7.4-alpine"))
                    .withExposedPorts(6379);
            REDIS.start();

            MOCK_WEB = new MockWebServer();
            MOCK_WEB.start();
        } catch (Exception e) {
            throw new RuntimeException("Failed to start test infrastructure (Kafka/Redis/MockWebServer)", e);
        }
    }

    @DynamicPropertySource
    static void registerProps(DynamicPropertyRegistry r) {
        r.add("spring.kafka.bootstrap-servers", KAFKA::getBootstrapServers);
        r.add("spring.data.redis.host", REDIS::getHost);
        r.add("spring.data.redis.port", () -> REDIS.getMappedPort(6379));
        r.add("botdefense.consumer.captchaProviderBaseUrl", () -> "http://localhost:" + MOCK_WEB.getPort());
    }

    private KafkaTemplate<String, Object> producer;

    @AfterAll
    static void stopDeps() throws Exception {
        MOCK_WEB.shutdown();
        REDIS.stop();
        KAFKA.stop();
    }

    @BeforeEach
    void initProducer() {
        Map<String, Object> cfg = new HashMap<>();
        cfg.put("bootstrap.servers", KAFKA.getBootstrapServers());
        cfg.put("key.serializer", org.apache.kafka.common.serialization.StringSerializer.class);
        cfg.put("value.serializer", JsonSerializer.class);
        cfg.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, false);
        producer = new KafkaTemplate<>(new DefaultKafkaProducerFactory<>(cfg));
    }

    @Test
    void successPublishesSecurityAction() {
        MOCK_WEB.enqueue(new MockResponse().setResponseCode(200).setBody("{\"status\":\"OK\"}"));

        BotDefenseEvent evt = new BotDefenseEvent(
                "e-1",
                Instant.now(),
                "cid-1",
                "login",
                "t1",
                "u1",
                "127.0.0.1",
                90,
                "CAPTCHA",
                "demo"
        );

        producer.send("captcha-stepup-events", evt.eventId(), evt);
        producer.flush();

        ConsumerRecord<String, SecurityActionRequest> out = pollOne("security-action-requests", SecurityActionRequest.class);
        assertNotNull(out);
        assertEquals("e-1", out.key());
        assertEquals("e-1", out.value().sourceEventId());
    }

    @Test
    void persistentFailurePublishesDlqAndDedupeSkipsSecondAttempt() {
        // 4 attempts (maxAttempts=4)
        MOCK_WEB.enqueue(new MockResponse().setResponseCode(503).setBody("down"));
        MOCK_WEB.enqueue(new MockResponse().setResponseCode(503).setBody("down"));
        MOCK_WEB.enqueue(new MockResponse().setResponseCode(503).setBody("down"));
        MOCK_WEB.enqueue(new MockResponse().setResponseCode(503).setBody("down"));

        BotDefenseEvent evt = new BotDefenseEvent(
                "e-2",
                Instant.now(),
                "cid-2",
                "login",
                "t1",
                "u1",
                "127.0.0.1",
                90,
                "CAPTCHA",
                "demo"
        );

        producer.send("captcha-stepup-events", evt.eventId(), evt);
        producer.flush();

        ConsumerRecord<String, CaptchaStepUpDlqEvent> dlq = pollOne("captcha-stepup-dlq", CaptchaStepUpDlqEvent.class);
        assertNotNull(dlq);
        assertEquals("e-2", dlq.key());
        assertEquals("e-2", dlq.value().original().eventId());

        // Send duplicate: should be ignored (no further HTTP calls; DLQ not produced again)
        producer.send("captcha-stepup-events", evt.eventId(), evt);
        producer.flush();

        ConsumerRecord<String, CaptchaStepUpDlqEvent> dlq2 = pollOne("captcha-stepup-dlq", CaptchaStepUpDlqEvent.class, 500);
        assertNull(dlq2);
    }

    private <T> ConsumerRecord<String, T> pollOne(String topic, Class<T> clazz) {
        return pollOne(topic, clazz, 3000);
    }

    private <T> ConsumerRecord<String, T> pollOne(String topic, Class<T> clazz, long timeoutMs) {
        Properties p = new Properties();
        p.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, KAFKA.getBootstrapServers());
        p.put(ConsumerConfig.GROUP_ID_CONFIG, "test-" + UUID.randomUUID());
        p.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        p.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        p.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        p.put(JsonDeserializer.TRUSTED_PACKAGES, "com.xrs.gateway.botdefense");
        p.put(JsonDeserializer.VALUE_DEFAULT_TYPE, clazz.getName());
        p.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);

        try (KafkaConsumer<String, T> c = new KafkaConsumer<>(p)) {
            c.subscribe(Collections.singletonList(topic));
            long end = System.currentTimeMillis() + timeoutMs;
            while (System.currentTimeMillis() < end) {
                var records = c.poll(java.time.Duration.ofMillis(200));
                for (ConsumerRecord<String, T> r : records) {
                    return r;
                }
            }
            return null;
        }
    }
}
