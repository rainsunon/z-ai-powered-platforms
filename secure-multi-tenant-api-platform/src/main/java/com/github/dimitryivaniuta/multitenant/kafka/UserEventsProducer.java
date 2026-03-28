package com.github.dimitryivaniuta.multitenant.kafka;

import com.github.dimitryivaniuta.multitenant.domain.UserEntity;
import java.nio.charset.StandardCharsets;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * Kafka producer for tenant-scoped user events.
 */
@Component
public class UserEventsProducer {

  public static final String TOPIC = "user-events";

  private final KafkaTemplate<String, Object> kafkaTemplate;

  public UserEventsProducer(KafkaTemplate<String, Object> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  /**
   * Publishes a "user created" event.
   */
  public void userCreated(UserEntity user) {
    UserCreatedEvent event = new UserCreatedEvent(
        user.getTenantId(),
        user.getId(),
        user.getEmail(),
        user.getFullName(),
        user.getCreatedAt()
    );

    ProducerRecord<String, Object> record = new ProducerRecord<>(TOPIC, user.getId().toString(), event);
    record.headers().add(new RecordHeader("tenantId", user.getTenantId().toString().getBytes(StandardCharsets.UTF_8)));

    kafkaTemplate.send(record);
  }
}
