package com.xrs.booking;

import com.xrs.booking.domain.BookingStatus;
import com.xrs.booking.repo.ApartmentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static com.xrs.booking.TestConstants.*;
import static com.xrs.booking.TestFixtures.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

/**
 * Verifies that availability search uses Redis cache for repeat requests.
 */
public class AvailabilityCachingIT extends AbstractIntegrationTest {

  @Autowired
  TestRestTemplate rest;

  @SpyBean
  ApartmentRepository apartmentRepository;

  @Test
  void secondSearchHitsCache_repoCalledOnce() {
    UUID apartmentId = createApartment(rest, "Cache Loft", CITY_GDANSK, 2);

    String url = buildAvailabilitySearchUrl(CITY_GDANSK, 2, TEST_DATE_START, TEST_DATE_END, 0, 20);

    ResponseEntity<String> r1 = rest.getForEntity(url, String.class);
    ResponseEntity<String> r2 = rest.getForEntity(url, String.class);

    assertThat(r1.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(r2.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(r1.getBody()).contains(apartmentId.toString());
    assertThat(r2.getBody()).contains(apartmentId.toString());

    // Repository method should be invoked once thanks to cache.
    Mockito.verify(apartmentRepository, Mockito.times(1)).searchAvailable(
        eq(CITY_GDANSK),
        eq(2),
        eq(TEST_DATE_START),
        eq(TEST_DATE_END),
        eq(BookingStatus.CANCELLED),
        eq(BookingStatus.EXPIRED),
        any()
    );
  }
}
