package com.xrs.booking;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static com.xrs.booking.TestConstants.*;
import static com.xrs.booking.TestFixtures.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration test for availability search endpoint.
 */
public class AvailabilitySearchIT extends AbstractIntegrationTest {

  @Autowired
  TestRestTemplate rest;

  @Test
  void searchByCityAndCapacity_filtersOutBookedApartments() {
    UUID a1 = createApartment(rest, "Sea View", CITY_GDANSK, 2);
    UUID a2 = createApartment(rest, "Big Loft", CITY_GDANSK, 5);
    UUID a3 = createApartment(rest, CITY_KRAKOW + " Flat", CITY_KRAKOW, 3);

    // Book a2 for the window, it should not appear in search results.
    createBookingHoldSuccessfully(rest, a2, TEST_DATE_START, TEST_DATE_END, "hold-a2");

    String url = buildAvailabilitySearchUrl(CITY_GDANSK, 2, TEST_DATE_START, TEST_DATE_END, 0, 50);
    ResponseEntity<String> response = rest.getForEntity(url, String.class);
    
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

    String body = response.getBody();
    assertThat(body)
        .as("Search results should include available apartments")
        .contains(a1.toString());
    assertThat(body)
        .as("Search results should not include booked apartment")
        .doesNotContain(a2.toString());
    assertThat(body)
        .as("Search results should not include apartments from other cities")
        .doesNotContain(CITY_KRAKOW);
  }
}
