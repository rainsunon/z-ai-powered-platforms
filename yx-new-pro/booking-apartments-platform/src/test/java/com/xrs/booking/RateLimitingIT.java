package com.xrs.booking;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import java.util.UUID;

import static com.xrs.booking.TestConstants.*;
import static com.xrs.booking.TestFixtures.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Validates Redis-backed rate limiting filter.
 */
@TestPropertySource(properties = {
    "app.rate-limit.enabled=true",
    "app.rate-limit.max-requests=3",
    "app.rate-limit.window-seconds=60",
    "app.rate-limit.path-prefixes[0]=/api"
})
public class RateLimitingIT extends AbstractIntegrationTest {

  @Autowired
  TestRestTemplate rest;

  @Test
  void afterLimit_excessRequestsReturn429() {
    UUID apartmentId = createApartment(rest, "RL Loft", CITY_GDANSK, 2);

    HttpHeaders headers = new HttpHeaders();
    headers.add("X-Client-Id", "client-rl-1");
    HttpEntity<Void> entity = new HttpEntity<>(headers);

    String apartmentUrl = API_APARTMENTS + "/" + apartmentId;

    // 3 requests allowed
    for (int i = 0; i < 3; i++) {
      ResponseEntity<String> response = rest.exchange(
          apartmentUrl,
          HttpMethod.GET,
          entity,
          String.class
      );
      assertThat(response.getStatusCode())
          .as("Request %d should succeed", i + 1)
          .isEqualTo(HttpStatus.OK);
    }

    // 4th request should be blocked
    ResponseEntity<String> blocked = rest.exchange(
        apartmentUrl,
        HttpMethod.GET,
        entity,
        String.class
    );
    assertThat(blocked.getStatusCode()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
    assertThat(blocked.getBody()).contains("TOO_MANY_REQUESTS");
  }
}
