package com.xrs.booking;

import com.xrs.booking.api.dto.BookingHoldRequest;
import com.xrs.booking.api.dto.BookingResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static com.xrs.booking.TestConstants.*;
import static com.xrs.booking.TestFixtures.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Validates that concurrent overlapping holds do not double-book an apartment.
 */
public class BookingConcurrencyIT extends AbstractIntegrationTest {

  private static final int CONCURRENT_REQUESTS = 25;
  private static final int THREAD_POOL_SIZE = 16;

  @Autowired
  TestRestTemplate rest;

  @Test
  void concurrentHolds_onlyOneSucceeds() throws Exception {
    UUID apartmentId = createApartment(rest, "Loft", CITY_GDANSK, 2);

    HttpHeaders userHeaders = getUserHeaders(rest);
    String userToken = userHeaders.getFirst(HttpHeaders.AUTHORIZATION);

    ExecutorService pool = Executors.newFixedThreadPool(THREAD_POOL_SIZE);
    List<Callable<ResponseEntity<BookingResponse>>> tasks = new ArrayList<>();
    
    for (int i = 0; i < CONCURRENT_REQUESTS; i++) {
      int idx = i;
      tasks.add(() -> attemptBooking(apartmentId, userToken, "key-" + idx));
    }

    List<Future<ResponseEntity<BookingResponse>>> futures = pool.invokeAll(tasks);
    pool.shutdown();

    long successCount = 0;
    long conflictCount = 0;
    
    for (Future<ResponseEntity<BookingResponse>> future : futures) {
      ResponseEntity<BookingResponse> response = future.get();
      if (response.getStatusCode().is2xxSuccessful()) {
        successCount++;
      } else if (response.getStatusCode() == HttpStatus.CONFLICT) {
        conflictCount++;
      }
    }

    assertThat(successCount)
        .as("Only one concurrent booking should succeed")
        .isEqualTo(1);
    assertThat(conflictCount)
        .as("All other bookings should receive conflict response")
        .isEqualTo(CONCURRENT_REQUESTS - 1);
  }

  private ResponseEntity<BookingResponse> attemptBooking(
      UUID apartmentId,
      String authToken,
      String idempotencyKey) {
    
    HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaders.AUTHORIZATION, authToken);
    headers.add("Idempotency-Key", idempotencyKey);
    
    BookingHoldRequest request = new BookingHoldRequest(
        apartmentId,
        TEST_DATE_START,
        TEST_DATE_END
    );
    
    return rest.postForEntity(
        API_BOOKINGS_HOLD,
        new HttpEntity<>(request, headers),
        BookingResponse.class
    );
  }
}
