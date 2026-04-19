package com.xrs.commerce.flight.flights.features.updateflight;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import com.xrs.commerce.flight.aircrafts.valueobjects.AircraftId;
import com.xrs.commerce.flight.airports.valueobjects.AirportId;
import com.xrs.commerce.flight.data.jpa.entities.FlightEntity;
import com.xrs.commerce.flight.data.jpa.repositories.FlightRepository;
import com.xrs.commerce.flight.flights.dtos.FlightDto;
import com.xrs.commerce.flight.flights.exceptions.FlightNotFoundException;
import com.xrs.commerce.flight.flights.features.Mappings;
import com.xrs.commerce.flight.flights.models.Flight;
import com.xrs.commerce.flight.flights.valueobjects.*;
import io.bookingmicroservices.flight.flights.valueobjects.*;
import org.springframework.stereotype.Service;

@Service
public class UpdateFlightCommandHandler implements ICommandHandler<UpdateFlightCommand, FlightDto> {
  private final FlightRepository flightRepository;

  public UpdateFlightCommandHandler(FlightRepository flightRepository) {
    this.flightRepository = flightRepository;
  }

  @Override
  public FlightDto handle(UpdateFlightCommand command) {

    FlightEntity existingFlight = flightRepository.findFlightByIdAndIsDeletedFalse(command.id());
    if (existingFlight == null) {
      throw new FlightNotFoundException();
    }

    Flight flight = Mappings.toFlightAggregate(existingFlight);

    flight.update(new FlightId(existingFlight.getId()), new FlightNumber(command.flightNumber()), new AircraftId(command.aircraftId()), new AirportId(command.departureAirportId()), new DepartureDate(command.departureDate()),
      new ArriveDate(command.arriveDate()), new AirportId(command.arriveAirportId()), new DurationMinutes(command.durationMinutes()), new FlightDate(command.flightDate()),
      command.status(), new Price(command.price()), command.isDeleted());

    FlightEntity flightEntity = Mappings.toFlightEntity(flight);

    FlightEntity updatedFlight = flightRepository.save(flightEntity);
    return Mappings.toFlightDto(updatedFlight);
  }
}
