package com.xrs.commerce.passenger.passengers.dtos;

import com.xrs.commerce.passenger.passengers.enums.PassengerType;
import java.util.UUID;

public record PassengerDto(
        UUID id,
        String name,
        String passportNumber,
        PassengerType passengerType,
        int age
) { }