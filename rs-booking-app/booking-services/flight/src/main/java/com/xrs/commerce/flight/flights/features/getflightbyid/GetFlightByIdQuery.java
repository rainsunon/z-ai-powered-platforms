package com.xrs.commerce.flight.flights.features.getflightbyid;

import buildingblocks.mediator.abstractions.queries.IQuery;
import com.xrs.commerce.flight.flights.dtos.FlightDto;
import java.util.UUID;

public record GetFlightByIdQuery(
  UUID id
) implements IQuery<FlightDto> {
}


