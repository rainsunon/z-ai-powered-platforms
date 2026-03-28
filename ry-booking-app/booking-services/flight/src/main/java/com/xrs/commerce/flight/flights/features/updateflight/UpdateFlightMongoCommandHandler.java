package com.xrs.commerce.flight.flights.features.updateflight;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import buildingblocks.mediator.abstractions.requests.Unit;
import com.xrs.commerce.flight.data.mongo.documents.FlightDocument;
import com.xrs.commerce.flight.data.mongo.repositories.FlightReadRepository;
import com.xrs.commerce.flight.flights.exceptions.FlightNotFoundException;
import com.xrs.commerce.flight.flights.features.Mappings;
import org.springframework.stereotype.Service;


@Service
public class UpdateFlightMongoCommandHandler implements ICommandHandler<UpdateFlightMongoCommand, Unit> {

  private final FlightReadRepository flightReadRepository;

  public UpdateFlightMongoCommandHandler(FlightReadRepository flightReadRepository) {
    this.flightReadRepository = flightReadRepository;
  }

  public Unit handle(UpdateFlightMongoCommand command) {

    FlightDocument flight = flightReadRepository.findByFlightIdAndIsDeletedFalse(command.id());

    if (flight == null) {
      throw new FlightNotFoundException();
    }

    FlightDocument flightDocument = Mappings.toFlightDocument(flight.getId(), command);

    flightReadRepository.save(flightDocument);

    return Unit.VALUE;
  }
}

