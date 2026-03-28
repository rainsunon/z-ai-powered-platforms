package com.xrs.commerce.flight;

import buildingblocks.contracts.flight.*;
import buildingblocks.core.event.EventMapper;
import buildingblocks.core.event.DomainEvent;
import buildingblocks.core.event.IntegrationEvent;
import buildingblocks.core.event.InternalCommand;
import com.xrs.commerce.flight.aircrafts.features.createaircraft.AircraftCreatedDomainEvent;
import com.xrs.commerce.flight.aircrafts.features.createaircraft.CreateAircraftMongoCommand;
import com.xrs.commerce.flight.airports.features.createairport.AirportCreatedDomainEvent;
import com.xrs.commerce.flight.airports.features.createairport.CreateAirportMongoCommand;
import com.xrs.commerce.flight.flights.features.createflight.CreateFlightMongoCommand;
import com.xrs.commerce.flight.flights.features.createflight.FlightCreatedDomainEvent;
import com.xrs.commerce.flight.flights.features.deleteflight.DeleteFlightMongoCommand;
import com.xrs.commerce.flight.flights.features.deleteflight.FlightDeletedDomainEvent;
import com.xrs.commerce.flight.flights.features.updateflight.FlightUpdatedDomainEvent;
import com.xrs.commerce.flight.flights.features.updateflight.UpdateFlightMongoCommand;
import com.xrs.commerce.flight.seats.features.createseat.CreateSeatMongoCommand;
import com.xrs.commerce.flight.seats.features.createseat.SeatCreatedDomainEvent;
import com.xrs.commerce.flight.seats.features.reserveseat.ReserveSeatMongoCommand;
import com.xrs.commerce.flight.seats.features.reserveseat.SeatReservedDomainEvent;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

@Component
public class EventMapperImpl implements EventMapper {
  @Override
  public IntegrationEvent MapToIntegrationEvent(@NotNull DomainEvent event) {
      return switch (event) {
        case FlightCreatedDomainEvent e -> new FlightCreated(e.id());
        case FlightUpdatedDomainEvent e -> new FlightUpdated(e.id());
        case FlightDeletedDomainEvent e -> new FlightDeleted(e.id());
        case AirportCreatedDomainEvent e -> new AirportCreated(e.id());
        case AircraftCreatedDomainEvent e -> new AircraftCreated(e.id());
        case SeatCreatedDomainEvent e -> new SeatCreated(e.id());
        case SeatReservedDomainEvent e -> new SeatReserved(e.id());
        default -> null;
      };
  }

  @Override
  public InternalCommand MapToInternalCommand(DomainEvent event) {
    return switch (event) {
      case FlightCreatedDomainEvent e -> new CreateFlightMongoCommand(e.id(), e.flightNumber(), e.aircraftId(), e.departureAirportId(),
        e.departureDate(), e.arriveDate(), e.arriveAirportId(), e.durationMinutes(), e.flightDate(), e.status(), e.price(), e.isDeleted());
      case FlightUpdatedDomainEvent e -> new UpdateFlightMongoCommand(e.id(), e.flightNumber(), e.aircraftId(), e.departureAirportId(),
        e.departureDate(), e.arriveDate(), e.arriveAirportId(), e.durationMinutes(), e.flightDate(), e.status(), e.price(), e.isDeleted());
      case FlightDeletedDomainEvent e -> new DeleteFlightMongoCommand(e.id(), e.flightNumber(), e.aircraftId(), e.departureAirportId(),
        e.departureDate(), e.arriveDate(), e.arriveAirportId(), e.durationMinutes(), e.flightDate(), e.status(), e.price(), e.isDeleted());
      case AirportCreatedDomainEvent e -> new CreateAirportMongoCommand(e.id(), e.name(), e.code(), e.address(), e.isDeleted());
      case AircraftCreatedDomainEvent e -> new CreateAircraftMongoCommand(e.id(), e.name(), e.model(), e.manufacturingYear(), e.isDeleted());
      case SeatCreatedDomainEvent e -> new CreateSeatMongoCommand(e.id(), e.seatNumber(), e.seatType(), e.seatClass(), e.flightId(), e.isDeleted());
      case SeatReservedDomainEvent e -> new ReserveSeatMongoCommand(e.id(), e.seatNumber(), e.seatType(), e.seatClass(), e.flightId(), e.isDeleted());
      default -> null;
    };
  }
}
