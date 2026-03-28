package com.xrs.commerce.flight.seats.features.getavailableseats;

import buildingblocks.mediator.abstractions.queries.IQuery;
import com.xrs.commerce.flight.seats.dtos.SeatDto;
import java.util.List;
import java.util.UUID;


public record GetAvailableSeatsQuery(
  UUID flightId
) implements IQuery<List<SeatDto>> {
}


