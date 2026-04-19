package com.xrs.commerce.booking.bookings.features.createbooking;

import buildingblocks.core.event.DomainEvent;
import com.xrs.commerce.booking.bookings.valueobjects.PassengerInfo;
import com.xrs.commerce.booking.bookings.valueobjects.Trip;
import java.util.UUID;


public record BookingCreatedDomainEvent(
        UUID id,
        PassengerInfo passengerInfo,
        Trip trip,
        boolean isDeleted) implements DomainEvent {
}
