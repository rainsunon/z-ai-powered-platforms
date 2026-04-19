package com.xrs.commerce.passenger.passengers.features.getpassengerbyid;

import buildingblocks.mediator.abstractions.queries.IQuery;
import com.xrs.commerce.passenger.passengers.dtos.PassengerDto;

import java.util.UUID;

public record GetPassengerByIdQuery(
        UUID id
) implements IQuery<PassengerDto> {
}

