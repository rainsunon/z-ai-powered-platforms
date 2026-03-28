package com.github.dimitryivaniuta.multitenant.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dimitryivaniuta.multitenant.api.dto.CreateUserRequest;
import com.github.dimitryivaniuta.multitenant.api.dto.UserResponse;
import com.github.dimitryivaniuta.multitenant.util.IntegrationTestBase;
import com.github.dimitryivaniuta.multitenant.util.JwtTestTokenFactory;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.ByteArrayDeserializer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.utils.KafkaTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies Kafka user events carry the tenant id as both payload and header.
 */
public class UserCreatedEventKafkaIT extends IntegrationTestBase {

  private static final String KID = "k1";
  private static final String PRIVATE_KEY = "keys/jwks-k1-private.pem.example";
  private static final String ISSUER = "https://auth.local";
  private static final String AUD = "api";

  @Autowired
  TestRestTemplate rest;

  @Autowired
  EmbeddedKafkaBroker embeddedKafka;

  @Autowired
  ObjectMapper objectMapper;

  private Consumer<String, byte[]> consumer;

  @AfterEach
  void cleanup() {
    if (consumer != null) {
      consumer.close(Duration.ofSeconds(1));
    }
  }

  @Test
  void userCreatedEvent_containsTenantHeader() throws Exception {
    UUID tenantId = UUID.randomUUID();
    String token = JwtTestTokenFactory.createToken(KID, PRIVATE_KEY, ISSUER, AUD, tenantId);

    // Create a user, which publishes Kafka event.
    UserResponse created = postUser(token, new CreateUserRequest("k@example.com", "Kafka"));
    assertThat(created.tenantId()).isEqualTo(tenantId);

    consumer = createConsumer();
    embeddedKafka.consumeFromAnEmbeddedTopic(consumer, UserEventsProducer.TOPIC);

    ConsumerRecord<String, byte[]> record = KafkaTestUtils.getSingleRecord(consumer, UserEventsProducer.TOPIC);

    // Header
    var header = record.headers().lastHeader("tenantId");
    assertThat(header).isNotNull();
    assertThat(new String(header.value(), StandardCharsets.UTF_8)).isEqualTo(tenantId.toString());

    // Payload
    UserCreatedEvent event = objectMapper.readValue(record.value(), UserCreatedEvent.class);
    assertThat(event.tenantId()).isEqualTo(tenantId);
    assertThat(event.userId()).isEqualTo(created.id());
  }

  private Consumer<String, byte[]> createConsumer() {
    Map<String, Object> props = KafkaTestUtils.consumerProps("it-group", "true", embeddedKafka);
    props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
    DefaultKafkaConsumerFactory<String, byte[]> cf = new DefaultKafkaConsumerFactory<>(
        props,
        new StringDeserializer(),
        new ByteArrayDeserializer()
    );
    return cf.createConsumer();
  }

  private UserResponse postUser(String token, CreateUserRequest req) {
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(token);
    headers.setContentType(MediaType.APPLICATION_JSON);

    ResponseEntity<UserResponse> res = rest.exchange(
        "/api/users",
        HttpMethod.POST,
        new HttpEntity<>(req, headers),
        UserResponse.class
    );
    assertThat(res.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    return res.getBody();
  }
}
