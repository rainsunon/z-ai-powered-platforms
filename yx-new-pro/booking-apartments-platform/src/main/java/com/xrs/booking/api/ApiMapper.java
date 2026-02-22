package com.xrs.booking.api;

import com.xrs.booking.api.dto.ApartmentResponse;
import com.xrs.booking.api.dto.BookingResponse;
import com.xrs.booking.domain.Apartment;
import com.xrs.booking.domain.Booking;

/**
 * Simple mapping utilities.
 */
public final class ApiMapper {

  private ApiMapper() {}

  /**
   * Maps {@link Apartment} to API response.
   */
  public static ApartmentResponse toResponse(Apartment a) {
    return new ApartmentResponse(a.getId(), a.getName(), a.getCity(), a.getCapacity(), a.getCreatedAt());
  }

  /**
   * Maps {@link Booking} to API response.
   */
  public static BookingResponse toResponse(Booking b) {
    return new BookingResponse(
        b.getId(),
        b.getApartmentId(),
        b.getUserId().toString(),
        b.getStartDate(),
        b.getEndDate(),
        b.getStatus().name(),
        b.getExpiresAt(),
        b.getCreatedAt(),
        b.getUpdatedAt()
    );
  }
}
