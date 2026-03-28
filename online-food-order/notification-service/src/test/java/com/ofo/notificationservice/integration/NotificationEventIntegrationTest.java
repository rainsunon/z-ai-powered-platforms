package com.ofo.notificationservice.integration;

import com.ofo.notificationservice.domain.event.OrderCreatedEvent;
import com.ofo.notificationservice.domain.model.Notification;
import com.ofo.notificationservice.domain.repository.NotificationRepository;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.LocalDateTime;
import java.util.UUID;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@Testcontainers
@ActiveProfiles("dev")
class NotificationEventIntegrationTest {

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.1"));

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("notification_db")
            .withUsername("postgres")
            .withPassword("password");

    @DynamicPropertySource
    static void registerProps(DynamicPropertyRegistry registry) {
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("notification.default.recipient", () -> "dev@ofo.local");
    }

    @Autowired
    KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    NotificationRepository notificationRepository;

    @Test
    void consumesOrderCreatedEventAndPersistsNotification() {
        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .orderId("ORDER-123")
                .userId("USER-1")
                .requestId(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now())
                .build();

        kafkaTemplate.send("order-created-events", event.getOrderId(), event);

        Awaitility.await().atMost(10, SECONDS).untilAsserted(() -> {
            assertThat(notificationRepository.findByUserIdOrderByCreatedAtDesc("USER-1"))
                    .anyMatch(n -> n.getType() == Notification.NotificationType.ORDER_CONFIRMATION);
        });
    }
}

