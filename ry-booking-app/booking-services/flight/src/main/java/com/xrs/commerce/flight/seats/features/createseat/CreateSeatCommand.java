package com.xrs.commerce.flight.seats.features.createseat;

import buildingblocks.core.event.InternalCommand;
import buildingblocks.mediator.abstractions.commands.ICommand;
import com.github.f4b6a3.uuid.UuidCreator;
import com.xrs.commerce.flight.seats.dtos.SeatDto;
import com.xrs.commerce.flight.seats.enums.SeatClass;
import com.xrs.commerce.flight.seats.enums.SeatType;

import java.util.UUID;

public record CreateSeatCommand(
  UUID id,
  String seatNumber,
  SeatType seatType,
  SeatClass seatClass,
  UUID flightId
) implements ICommand<SeatDto>, InternalCommand {
}


