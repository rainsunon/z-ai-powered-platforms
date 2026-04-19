package com.xrs.commerce.passenger.passengers.features.createpassenger;

import com.xrs.commerce.passenger.passengers.enums.PassengerType;

public record CreatePassengerRequestDto(
        String name,
        String PassportNumber,
        PassengerType passengerType,
        int age){
}

