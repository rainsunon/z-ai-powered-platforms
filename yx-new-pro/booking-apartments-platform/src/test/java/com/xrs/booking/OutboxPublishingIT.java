package com.xrs.booking;

import com.xrs.booking.outbox.OutboxRepository;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;

import java.time.LocalDate;
import java.util.UUID;

import static com.xrs.booking.TestConstants.*;
import static com.xrs.booking.TestFixtures.*;
import static java.time.Duration.ofSeconds;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Ensures the polling outbox publisher marks messages as published after Kafka publish.
 */
public class OutboxPublishingIT extends AbstractIntegrationTest {

  @Autowired
  TestRestTemplate rest;
  
  @Autowired
  OutboxRepository outboxRepository;

  @Test
  void outboxMessages_getPublished() {
    UUID apartmentId = createApartment(rest, "Penthouse", CITY_GDANSK, 4);

    createBookingHoldSuccessfully(
        rest,
        apartmentId,
        LocalDate.of(2026, 2, 20),
        LocalDate.of(2026, 2, 22),
        "idem-publish-1"
    );

    Awaitility.await().atMost(ofSeconds(15)).untilAsserted(() -> {
      long unpublished = outboxRepository.findNextBatch(1000).size();
      assertThat(unpublished).isEqualTo(0);
    });
  }
}
