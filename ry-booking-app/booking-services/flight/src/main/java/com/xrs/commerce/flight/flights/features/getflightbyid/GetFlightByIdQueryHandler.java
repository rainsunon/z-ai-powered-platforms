package com.xrs.commerce.flight.flights.features.getflightbyid;

import buildingblocks.mediator.abstractions.queries.IQueryHandler;
import com.xrs.commerce.flight.data.mongo.documents.FlightDocument;
import com.xrs.commerce.flight.data.mongo.repositories.FlightReadRepository;
import com.xrs.commerce.flight.flights.dtos.FlightDto;
import com.xrs.commerce.flight.flights.exceptions.FlightNotFoundException;
import com.xrs.commerce.flight.flights.features.Mappings;
import org.springframework.stereotype.Service;

@Service
public class GetFlightByIdQueryHandler implements IQueryHandler<GetFlightByIdQuery, FlightDto> {
  private final FlightReadRepository flightReadRepository;

  public GetFlightByIdQueryHandler(FlightReadRepository flightReadRepository) {
    this.flightReadRepository = flightReadRepository;
  }

  @Override
  public FlightDto handle(GetFlightByIdQuery query) {
    FlightDocument flightDocument = flightReadRepository.findByFlightIdAndIsDeletedFalse(query.id());

    if (flightDocument == null) {
      throw new FlightNotFoundException();
    }

    return Mappings.toFlightDto(flightDocument);
  }
}
