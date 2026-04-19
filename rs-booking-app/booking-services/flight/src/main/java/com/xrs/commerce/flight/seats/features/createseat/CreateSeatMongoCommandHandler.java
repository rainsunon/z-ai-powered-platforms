package com.xrs.commerce.flight.seats.features.createseat;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import buildingblocks.mediator.abstractions.requests.Unit;
import com.xrs.commerce.flight.data.mongo.documents.SeatDocument;
import com.xrs.commerce.flight.data.mongo.repositories.SeatReadRepository;
import com.xrs.commerce.flight.seats.exceptions.SeatAlreadyExistException;
import com.xrs.commerce.flight.seats.features.Mappings;
import org.springframework.stereotype.Service;


@Service
public class CreateSeatMongoCommandHandler implements ICommandHandler<CreateSeatMongoCommand, Unit> {

  private final SeatReadRepository seatReadRepository;

  public CreateSeatMongoCommandHandler(SeatReadRepository seatReadRepository) {
    this.seatReadRepository = seatReadRepository;
  }

  public Unit handle(CreateSeatMongoCommand command) {

    SeatDocument seatDocument = Mappings.toSeatDocument(command);

    var seatExist = seatReadRepository.findSeatByFlightIdAndSeatNumberAndIsDeletedFalse(seatDocument.getFlightId(), seatDocument.getSeatNumber());

    if (seatExist != null) {
      throw new SeatAlreadyExistException();
    }

    seatReadRepository.save(seatDocument);

    return Unit.VALUE;
  }
}

