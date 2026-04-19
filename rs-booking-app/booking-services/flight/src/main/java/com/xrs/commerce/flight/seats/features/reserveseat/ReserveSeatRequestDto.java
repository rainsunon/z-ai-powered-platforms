package com.xrs.commerce.flight.seats.features.reserveseat;

import java.util.UUID;

public record ReserveSeatRequestDto(
  String seatNumber,
  UUID flightId){
}

