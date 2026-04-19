package com.xrs.commerce.flight.seats.features.createseat;

import buildingblocks.core.event.DomainEvent;
import com.xrs.commerce.flight.seats.enums.SeatClass;
import com.xrs.commerce.flight.seats.enums.SeatType;
import java.util.UUID;


public record SeatCreatedDomainEvent(
  UUID id,
  String seatNumber,
  SeatType seatType,
  SeatClass seatClass,
  UUID flightId,
  boolean isDeleted) implements DomainEvent {
}

