package com.xrs.booking;

import com.xrs.booking.api.dto.ApartmentCreateRequest;
import com.xrs.booking.api.dto.BookingHoldRequest;
import com.xrs.booking.api.dto.BookingResponse;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.UUID;

import static com.xrs.booking.TestConstants.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test fixtures providing reusable methods for common test operations.
 * Eliminates code duplication across integration tests.
 */
public final class TestFixtures {

  private TestFixtures() {}

  /**
   * Creates an apartment as admin and returns its ID.
   *
   * @param rest the test REST template
   * @param name the apartment name
   * @param city the city
   * @param capacity the capacity
   * @return the created apartment ID
   */
  public static UUID createApartment(TestRestTemplate rest, String name, String city, int capacity) {
    HttpHeaders adminHeaders = getAdminHeaders(rest);
    ApartmentCreateRequest request = new ApartmentCreateRequest(name, city, capacity);
    
    ResponseEntity<String> response = rest.postForEntity(
        API_APARTMENTS,
        new HttpEntity<>(request, adminHeaders),
        String.class
    );
    
    assertThat(response.getStatusCode())
        .as("Apartment creation should succeed")
        .isEqualTo(HttpStatus.OK);
    
    return JsonTestUtils.extractId(response.getBody());
  }

  /**
   * Creates a booking hold for a user and returns the booking response.
   *
   * @param rest the test REST template
   * @param apartmentId the apartment ID
   * @param from check-in date
   * @param to check-out date
   * @param idempotencyKey the idempotency key
   * @return the booking response
   */
  public static ResponseEntity<BookingResponse> createBookingHold(
      TestRestTemplate rest,
      UUID apartmentId,
      LocalDate from,
      LocalDate to,
      String idempotencyKey) {
    
    HttpHeaders userHeaders = getUserHeaders(rest);
    userHeaders.add("Idempotency-Key", idempotencyKey);
    
    BookingHoldRequest request = new BookingHoldRequest(apartmentId, from, to);
    
    return rest.postForEntity(
        API_BOOKINGS_HOLD,
        new HttpEntity<>(request, userHeaders),
        BookingResponse.class
    );
  }

  /**
   * Creates a booking hold and asserts it succeeds, returning the booking ID.
   *
   * @param rest the test REST template
   * @param apartmentId the apartment ID
   * @param from check-in date
   * @param to check-out date
   * @param idempotencyKey the idempotency key
   * @return the created booking ID
   */
  public static UUID createBookingHoldSuccessfully(
      TestRestTemplate rest,
      UUID apartmentId,
      LocalDate from,
      LocalDate to,
      String idempotencyKey) {
    
    ResponseEntity<BookingResponse> response = createBookingHold(
        rest, apartmentId, from, to, idempotencyKey
    );
    
    assertThat(response.getStatusCode().is2xxSuccessful())
        .as("Booking hold creation should succeed")
        .isTrue();
    
    assertThat(response.getBody())
        .as("Booking response body should not be null")
        .isNotNull();
    
    return response.getBody().id();
  }

  /**
   * Gets authenticated headers for an admin user.
   *
   * @param rest the test REST template
   * @return HTTP headers with admin authentication
   */
  public static HttpHeaders getAdminHeaders(TestRestTemplate rest) {
    return TestAuth.loginHeaders(rest, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_DEVICE_ID);
  }

  /**
   * Gets authenticated headers for a regular user.
   *
   * @param rest the test REST template
   * @return HTTP headers with user authentication
   */
  public static HttpHeaders getUserHeaders(TestRestTemplate rest) {
    return TestAuth.loginHeaders(rest, USER_EMAIL, USER_PASSWORD, USER_DEVICE_ID);
  }

  /**
   * Builds an availability search URL with the given parameters.
   *
   * @param city the city to search in
   * @param capacity minimum capacity
   * @param from check-in date
   * @param to check-out date
   * @param page page number
   * @param size page size
   * @return the formatted URL
   */
  public static String buildAvailabilitySearchUrl(
      String city,
      int capacity,
      LocalDate from,
      LocalDate to,
      int page,
      int size) {
    
    return String.format(
        "%s?city=%s&capacity=%d&from=%s&to=%s&page=%d&size=%d",
        API_AVAILABILITY_SEARCH,
        city,
        capacity,
        from,
        to,
        page,
        size
    );
  }
}
