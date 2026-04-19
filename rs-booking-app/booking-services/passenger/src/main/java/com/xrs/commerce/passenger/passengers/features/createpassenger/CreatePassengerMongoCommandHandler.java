package com.xrs.commerce.passenger.passengers.features.createpassenger;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import buildingblocks.mediator.abstractions.requests.Unit;
import com.xrs.commerce.passenger.data.mongo.documents.PassengerDocument;
import com.xrs.commerce.passenger.data.mongo.repositories.PassengerReadRepository;
import com.xrs.commerce.passenger.passengers.exceptions.PassengerAlreadyExistException;
import com.xrs.commerce.passenger.passengers.features.Mappings;
import org.springframework.stereotype.Service;

@Service
public class CreatePassengerMongoCommandHandler implements ICommandHandler<CreatePassengerMongoCommand, Unit> {

    private final PassengerReadRepository passengerReadRepository;

    public CreatePassengerMongoCommandHandler(PassengerReadRepository passengerReadRepository) {
        this.passengerReadRepository = passengerReadRepository;
    }

    public Unit handle(CreatePassengerMongoCommand command) {

        PassengerDocument passengerDocument = Mappings.toPassengerDocument(command);

        var passengerExist = passengerReadRepository.findPassengerByPassengerIdAndIsDeletedFalse(passengerDocument.getPassengerId());

        if (passengerExist != null) {
            throw new PassengerAlreadyExistException();
        }

        passengerReadRepository.save(passengerDocument);

        return Unit.VALUE;
    }
}

