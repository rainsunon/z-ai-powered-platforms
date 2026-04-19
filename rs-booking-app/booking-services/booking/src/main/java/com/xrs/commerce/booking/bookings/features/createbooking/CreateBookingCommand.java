package com.xrs.commerce.booking.bookings.features.createbooking;

import buildingblocks.core.event.InternalCommand;
import buildingblocks.mediator.abstractions.commands.ICommand;
import com.github.f4b6a3.uuid.UuidCreator;
import com.xrs.commerce.booking.bookings.dtos.BookingDto;

import java.util.UUID;

public record CreateBookingCommand(
        UUID id,
        UUID passengerId,
        UUID flightId,
        String description
) implements ICommand<BookingDto>, InternalCommand {
}