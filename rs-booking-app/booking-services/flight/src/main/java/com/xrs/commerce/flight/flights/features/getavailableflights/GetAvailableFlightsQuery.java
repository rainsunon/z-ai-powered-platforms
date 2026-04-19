package com.xrs.commerce.flight.flights.features.getavailableflights;

import buildingblocks.mediator.abstractions.queries.IQuery;
import com.xrs.commerce.flight.flights.dtos.FlightDto;
import java.util.List;

public record GetAvailableFlightsQuery() implements IQuery<List<FlightDto>> {
}


