package com.xrs.commerce.passenger.passengers.features.createpassenger;

import buildingblocks.core.event.DomainEvent;
import com.xrs.commerce.passenger.passengers.enums.PassengerType;
import java.util.UUID;

public record PassengerCreatedDomainEvent(
        UUID id,
        String name,
        String passportNumber,
        PassengerType passengerType,
        int age,
        boolean isDeleted) implements DomainEvent {
}