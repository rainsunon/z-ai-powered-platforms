package com.xrs.booking;

import com.xrs.booking.api.dto.BookingHoldRequest;
import com.xrs.booking.api.dto.BookingResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static com.xrs.booking.TestConstants.*;
import static com.xrs.booking.TestFixtures.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Validates that Idempotency-Key returns the same booking on retries.
 */
public class IdempotencyIT extends AbstractIntegrationTest {

  @Autowired
  TestRestTemplate rest;

  @Test
  void idempotencyKey_returnsSameBooking() {
    UUID apartmentId = createApartment(rest, "Studio", CITY_GDANSK, 2);

    BookingHoldRequest request = new BookingHoldRequest(
        apartmentId,
        TEST_DATE_ALT_START,
        TEST_DATE_ALT_END
    );

    HttpHeaders userHeaders = getUserHeaders(rest);
    userHeaders.add("Idempotency-Key", "idem-1");

    ResponseEntity<BookingResponse> r1 = rest.postForEntity(
        API_BOOKINGS_HOLD,
        new HttpEntity<>(request, userHeaders),
        BookingResponse.class
    );
    
    ResponseEntity<BookingResponse> r2 = rest.postForEntity(
        API_BOOKINGS_HOLD,
        new HttpEntity<>(request, userHeaders),
        BookingResponse.class
    );

    assertThat(r1.getStatusCode().is2xxSuccessful()).isTrue();
    assertThat(r2.getStatusCode().is2xxSuccessful()).isTrue();
    assertThat(r1.getBody().id()).isEqualTo(r2.getBody().id());
  }
}
