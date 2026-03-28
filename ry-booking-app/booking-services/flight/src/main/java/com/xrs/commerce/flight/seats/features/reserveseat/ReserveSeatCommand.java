package com.xrs.commerce.flight.seats.features.reserveseat;

import buildingblocks.core.event.InternalCommand;
import buildingblocks.mediator.abstractions.commands.ICommand;
import com.xrs.commerce.flight.seats.dtos.SeatDto;
import java.util.UUID;


public record ReserveSeatCommand(
  String seatNumber,
  UUID flightId
) implements ICommand<SeatDto>, InternalCommand {
}

