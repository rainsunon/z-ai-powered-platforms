package com.xrs.commerce.flight.aircrafts.features.createaircraft;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import buildingblocks.mediator.abstractions.requests.Unit;
import com.xrs.commerce.flight.aircrafts.exceptions.AircraftAlreadyExistException;
import com.xrs.commerce.flight.aircrafts.features.Mappings;
import com.xrs.commerce.flight.data.mongo.documents.AircraftDocument;
import com.xrs.commerce.flight.data.mongo.repositories.AircraftReadRepository;
import org.springframework.stereotype.Service;


@Service
public class CreateAircraftMongoCommandHandler implements ICommandHandler<CreateAircraftMongoCommand, Unit> {

  private final AircraftReadRepository aircraftReadRepository;

  public CreateAircraftMongoCommandHandler(AircraftReadRepository aircraftReadRepository) {
    this.aircraftReadRepository = aircraftReadRepository;
  }

  public Unit handle(CreateAircraftMongoCommand command) {

    AircraftDocument aircraftDocument = Mappings.toAircraftDocument(command);

    var aircraftExist = aircraftReadRepository.findByAircraftIdAndIsDeletedFalse(aircraftDocument.getAircraftId());

    if (aircraftExist != null) {
      throw new AircraftAlreadyExistException();
    }

    aircraftReadRepository.save(aircraftDocument);

    return Unit.VALUE;
  }
}

