package com.xrs.booking;

import java.time.LocalDate;

/**
 * Constants for test data to ensure consistency across test classes.
 */
public final class TestConstants {

  private TestConstants() {}

  // Test users
  public static final String ADMIN_EMAIL = "admin@local.test";
  public static final String ADMIN_PASSWORD = "AdminPassword123!";
  public static final String ADMIN_DEVICE_ID = "it-admin";

  public static final String USER_EMAIL = "user1@local.test";
  public static final String USER_PASSWORD = "UserPassword123!";
  public static final String USER_DEVICE_ID = "it-user";

  // Test dates
  public static final LocalDate TEST_DATE_START = LocalDate.of(2026, 2, 1);
  public static final LocalDate TEST_DATE_END = LocalDate.of(2026, 2, 5);
  public static final LocalDate TEST_DATE_ALT_START = LocalDate.of(2026, 2, 10);
  public static final LocalDate TEST_DATE_ALT_END = LocalDate.of(2026, 2, 12);

  // Test locations
  public static final String CITY_GDANSK = "Gdansk";
  public static final String CITY_KRAKOW = "Krakow";

  // API endpoints
  public static final String API_APARTMENTS = "/api/apartments";
  public static final String API_BOOKINGS_HOLD = "/api/bookings/hold";
  public static final String API_AVAILABILITY_SEARCH = "/api/availability/search";
}
