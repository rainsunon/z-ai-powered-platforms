package com.xrs.commerce.booking.bookings.features.createbooking;

import buildingblocks.core.event.InternalCommand;
import buildingblocks.mediator.abstractions.commands.ICommand;
import buildingblocks.mediator.abstractions.requests.Unit;
import com.xrs.commerce.booking.bookings.valueobjects.PassengerInfo;
import com.xrs.commerce.booking.bookings.valueobjects.Trip;
import java.util.UUID;


public record CreateBookingMongoCommand(
        UUID id,
        PassengerInfo passengerInfo,
        Trip trip,
        boolean isDeleted) implements ICommand<Unit>, InternalCommand {
}

