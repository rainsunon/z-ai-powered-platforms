package com.xrs.commerce.flight.aircrafts.features.createaircraft;

import buildingblocks.core.event.InternalCommand;
import buildingblocks.mediator.abstractions.commands.ICommand;
import com.github.f4b6a3.uuid.UuidCreator;
import com.xrs.commerce.flight.aircrafts.dtos.AircraftDto;

import java.util.UUID;

public record CreateAircraftCommand(
  UUID id,
  String name,
  String model,
  int manufacturingYear
) implements ICommand<AircraftDto>, InternalCommand {
}

