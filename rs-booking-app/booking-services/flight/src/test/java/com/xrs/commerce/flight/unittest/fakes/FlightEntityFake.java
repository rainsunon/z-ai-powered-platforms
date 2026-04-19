package com.xrs.commerce.flight.unittest.fakes;

import com.xrs.commerce.flight.data.jpa.entities.FlightEntity;
import com.xrs.commerce.flight.flights.features.Mappings;
import com.xrs.commerce.flight.flights.features.createflight.CreateFlightCommand;

public class FlightEntityFake {
  public static FlightEntity generate(){
   CreateFlightCommand command =  CreateFlightCommandFake.generate();
    return Mappings.toFlightEntity(command);
  }
}
