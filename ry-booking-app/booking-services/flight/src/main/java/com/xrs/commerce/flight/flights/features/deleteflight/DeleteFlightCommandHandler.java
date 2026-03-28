package com.xrs.commerce.flight.flights.features.deleteflight;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import com.xrs.commerce.flight.data.jpa.entities.FlightEntity;
import com.xrs.commerce.flight.data.jpa.repositories.FlightRepository;
import com.xrs.commerce.flight.flights.dtos.FlightDto;
import com.xrs.commerce.flight.flights.exceptions.FlightNotFoundException;
import com.xrs.commerce.flight.flights.features.Mappings;
import com.xrs.commerce.flight.flights.models.Flight;
import org.springframework.stereotype.Component;

@Component
public class DeleteFlightCommandHandler implements ICommandHandler<DeleteFlightCommand, FlightDto> {
  private final FlightRepository flightRepository;

  public DeleteFlightCommandHandler(FlightRepository flightRepository) {
    this.flightRepository = flightRepository;
  }

  @Override
  public FlightDto handle(DeleteFlightCommand command) {

    FlightEntity existingFlight = flightRepository.findFlightByIdAndIsDeletedFalse(command.id());
    if (existingFlight == null) {
      throw new FlightNotFoundException();
    }

    Flight flight = Mappings.toFlightAggregate(existingFlight);

    flight.delete();

    FlightEntity flightEntity = Mappings.toFlightEntity(flight);

    FlightEntity updatedFlight = flightRepository.save(flightEntity);
    return Mappings.toFlightDto(updatedFlight);
  }
}
