package com.xrs.commerce.flight.flights.features.getavailableflights;

import buildingblocks.mediator.abstractions.queries.IQueryHandler;
import com.xrs.commerce.flight.data.mongo.documents.FlightDocument;
import com.xrs.commerce.flight.data.mongo.repositories.FlightReadRepository;
import com.xrs.commerce.flight.flights.dtos.FlightDto;
import com.xrs.commerce.flight.flights.features.Mappings;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAvailableFlightsQueryHandler implements IQueryHandler<GetAvailableFlightsQuery, List<FlightDto>> {
  private final FlightReadRepository flightReadRepository;

  public GetAvailableFlightsQueryHandler(FlightReadRepository flightReadRepository) {
    this.flightReadRepository = flightReadRepository;
  }

  @Override
  public List<FlightDto> handle(GetAvailableFlightsQuery query) {
    List<FlightDocument> flightDocuments =  flightReadRepository.findAllByIsDeletedFalse();
    return flightDocuments.stream().map(Mappings::toFlightDto).toList();
  }
}
