package com.xrs.commerce.flight.seats.dtos;

import com.xrs.commerce.flight.seats.enums.SeatClass;
import com.xrs.commerce.flight.seats.enums.SeatType;
import java.util.UUID;

public record SeatDto(
  UUID id,
  String seatNumber,
  SeatType seatType,
  SeatClass seatClass,
  UUID flightId
) { }
