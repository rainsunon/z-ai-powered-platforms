package com.xrs.commerce.flight.data.jpa.seeds;

import com.github.f4b6a3.uuid.UuidCreator;
import com.xrs.commerce.flight.aircrafts.valueobjects.AircraftId;
import com.xrs.commerce.flight.aircrafts.valueobjects.ManufacturingYear;
import com.xrs.commerce.flight.aircrafts.valueobjects.Name;
import com.xrs.commerce.flight.aircrafts.valueobjects.Model;
import com.xrs.commerce.flight.airports.valueobjects.Address;
import com.xrs.commerce.flight.airports.valueobjects.AirportId;
import com.xrs.commerce.flight.airports.valueobjects.Code;
import com.xrs.commerce.flight.data.jpa.entities.AircraftEntity;
import com.xrs.commerce.flight.data.jpa.entities.AirportEntity;
import com.xrs.commerce.flight.data.jpa.entities.FlightEntity;
import com.xrs.commerce.flight.data.jpa.entities.SeatEntity;
import com.xrs.commerce.flight.flights.enums.FlightStatus;
import com.xrs.commerce.flight.flights.valueobjects.*;
import io.bookingmicroservices.flight.flights.valueobjects.*;
import com.xrs.commerce.flight.seats.enums.SeatClass;
import com.xrs.commerce.flight.seats.enums.SeatType;
import com.xrs.commerce.flight.seats.valueobjects.FlightId;
import com.xrs.commerce.flight.seats.valueobjects.SeatNumber;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class InitialData {

  public static final List<FlightEntity> flights;
  public static final List<AirportEntity> airports;
  public static final List<AircraftEntity> aircrafts;
  public static final List<SeatEntity> seats;

  static  {
    airports = new ArrayList<>();
    airports.add(new AirportEntity(UUID.fromString("3c5c0000-97c6-fc34-a0cb-08db322230c8"), new com.xrs.commerce.flight.airports.valueobjects.Name("Lisbon International Airport"), new Code("LIS"), new Address("12988")));
    airports.add(new AirportEntity(UUID.fromString("3c5c0000-97c6-fc34-fc3c-08db322230c8"), new com.xrs.commerce.flight.airports.valueobjects.Name("Sao Paulo International Airport"), new Code("BRZ"), new Address("11200")));

    aircrafts = new ArrayList<>();
    aircrafts.add(new AircraftEntity(UUID.fromString("3c5c0000-97c6-fc34-fcd3-08db322230c8"), new Name("Boeing 737"), new Model("B737"), new ManufacturingYear(2005)));
    aircrafts.add(new AircraftEntity(UUID.fromString("3c5c0000-97c6-fc34-2e04-08db322230c9"), new Name("Airbus 300"), new Model("A300"), new ManufacturingYear(2000)));
    aircrafts.add(new AircraftEntity(UUID.fromString("3c5c0000-97c6-fc34-2e11-08db322230c9"), new Name("Airbus 320"), new Model("A320"), new ManufacturingYear(2003)));

    flights = new ArrayList<>();
    flights.add(new FlightEntity(UUID.fromString("3c5c0000-97c6-fc34-2eb9-08db322230c9"), new FlightNumber("BD467"),
      new AircraftId(aircrafts.getFirst().getId()), new AirportId(airports.getFirst().getId()), new AirportId(airports.getLast().getId()), new DurationMinutes(new BigDecimal(120)), FlightStatus.Completed, new Price(new BigDecimal(8000)), new ArriveDate(LocalDateTime.of(2022, 1, 31, 12, 0)),
      new DepartureDate(LocalDateTime.of(2022, 1, 31, 14, 0)),
      new FlightDate(LocalDateTime.of(2022, 1, 31, 13, 0))));

    seats = new ArrayList<>();
    seats.add(new SeatEntity(UuidCreator.getTimeOrderedEpoch(), new SeatNumber("12A"), SeatType.Window, SeatClass.Economy, new FlightId(flights.get(0).getId())));
    seats.add(new SeatEntity(UuidCreator.getTimeOrderedEpoch(), new SeatNumber("12B"), SeatType.Window, SeatClass.Economy, new FlightId(flights.get(0).getId())));
    seats.add(new SeatEntity(UuidCreator.getTimeOrderedEpoch(), new SeatNumber("12C") , SeatType.Middle, SeatClass.Economy, new FlightId(flights.get(0).getId())));
    seats.add(new SeatEntity(UuidCreator.getTimeOrderedEpoch(), new SeatNumber("12D"), SeatType.Middle, SeatClass.Economy, new FlightId(flights.get(0).getId())));
    seats.add(new SeatEntity(UuidCreator.getTimeOrderedEpoch(), new SeatNumber("12E"), SeatType.Aisle, SeatClass.Economy, new FlightId(flights.get(0).getId())));
    seats.add(new SeatEntity(UuidCreator.getTimeOrderedEpoch(), new SeatNumber("12F"), SeatType.Aisle, SeatClass.Economy, new FlightId(flights.get(0).getId())));
  }
}
