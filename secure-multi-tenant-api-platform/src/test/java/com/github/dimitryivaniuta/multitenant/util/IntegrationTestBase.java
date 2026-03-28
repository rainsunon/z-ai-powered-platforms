package com.github.dimitryivaniuta.multitenant.util;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Base class for integration tests using Testcontainers (PostgreSQL + Redis) and Embedded Kafka.
 */
@Testcontainers
@EmbeddedKafka(partitions = 1, topics = {"user-events"})
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {
        "spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}"
    }
)
public abstract class IntegrationTestBase {

  @Container
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
      .withDatabaseName("tenantdb")
      .withUsername("tenant")
      .withPassword("tenant");

  @Container
  static final GenericContainer<?> REDIS = new GenericContainer<>("redis:7-alpine")
      .withExposedPorts(6379);

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    registry.add("spring.datasource.username", POSTGRES::getUsername);
    registry.add("spring.datasource.password", POSTGRES::getPassword);

    registry.add("spring.data.redis.host", REDIS::getHost);
    registry.add("spring.data.redis.port", () -> REDIS.getMappedPort(6379));

    // Test JWT config
    registry.add("app.security.jwt.issuer", () -> "https://auth.local");
    registry.add("app.security.jwt.audience", () -> "api");
    registry.add("app.security.jwt.jwks.keys[0].kid", () -> "k1");
    registry.add("app.security.jwt.jwks.keys[0].publicKeyLocation", () -> "classpath:keys/jwks-k1-public.pem.example.example");
    registry.add("app.security.jwt.jwks.keys[1].kid", () -> "k2");
    registry.add("app.security.jwt.jwks.keys[1].publicKeyLocation", () -> "classpath:keys/jwks-k2-public.pem.example.example");
      }
}
