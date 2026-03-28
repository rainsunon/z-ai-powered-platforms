package com.xrs.commerce.passenger.passengers.features.createpassenger;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import com.xrs.commerce.passenger.data.jpa.entities.PassengerEntity;
import com.xrs.commerce.passenger.data.jpa.repositories.PassengerRepository;
import com.xrs.commerce.passenger.passengers.dtos.PassengerDto;
import com.xrs.commerce.passenger.passengers.exceptions.PassengerAlreadyExistException;
import com.xrs.commerce.passenger.passengers.features.Mappings;
import com.xrs.commerce.passenger.passengers.models.Passenger;
import com.xrs.commerce.passenger.passengers.valueobjects.Age;
import com.xrs.commerce.passenger.passengers.valueobjects.Name;
import com.xrs.commerce.passenger.passengers.valueobjects.PassengerId;
import com.xrs.commerce.passenger.passengers.valueobjects.PassportNumber;
import org.springframework.stereotype.Service;

@Service
public class CreatePassengerCommandHandler implements ICommandHandler<CreatePassengerCommand, PassengerDto> {
    private final PassengerRepository passengerRepository;

    public CreatePassengerCommandHandler(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    @Override
    public PassengerDto handle(CreatePassengerCommand command) {

        PassengerEntity existPassenger = passengerRepository.findPassengerByPassportNumberAndIsDeletedFalse(command.passportNumber());
        if (existPassenger != null) {
         throw new PassengerAlreadyExistException();
        }

        Passenger passengerAggregate = Passenger.create(
                new PassengerId(command.id()),
                new Name(command.name()),
                new PassportNumber(command.passportNumber()),
                command.passengerType(),
                new Age(command.age())
        );

        PassengerEntity passengerEntity = Mappings.toPassengerEntity(passengerAggregate);

        PassengerEntity createdPassenger = passengerRepository.save(passengerEntity);

        return Mappings.toPassengerDto(createdPassenger);
    }
}
