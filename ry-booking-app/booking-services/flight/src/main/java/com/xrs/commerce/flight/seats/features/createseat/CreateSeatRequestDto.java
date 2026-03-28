package com.xrs.commerce.flight.seats.features.createseat;

import com.xrs.commerce.flight.seats.enums.SeatClass;
import com.xrs.commerce.flight.seats.enums.SeatType;
import java.util.UUID;

public record CreateSeatRequestDto(
  String seatNumber,
  SeatType seatType,
  SeatClass seatClass,
  UUID flightId){
}

