package com.xrs.commerce.flight.seats.features.reserveseat;

import buildingblocks.core.event.InternalCommand;
import buildingblocks.mediator.abstractions.commands.ICommand;
import buildingblocks.mediator.abstractions.requests.Unit;
import com.xrs.commerce.flight.seats.enums.SeatClass;
import com.xrs.commerce.flight.seats.enums.SeatType;
import java.util.UUID;

public record ReserveSeatMongoCommand(
  UUID id,
  String seatNumber,
  SeatType seatType,
  SeatClass seatClass,
  UUID flightId,
  boolean isDeleted) implements ICommand<Unit>, InternalCommand {
}
