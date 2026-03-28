package com.xrs.commerce.passenger.data.jpa.seeds;

import com.xrs.commerce.passenger.data.jpa.entities.PassengerEntity;
import com.xrs.commerce.passenger.passengers.enums.PassengerType;
import com.xrs.commerce.passenger.passengers.valueobjects.Age;
import com.xrs.commerce.passenger.passengers.valueobjects.Name;
import com.xrs.commerce.passenger.passengers.valueobjects.PassportNumber;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


public final class InitialPassengerData {

    public static final List<PassengerEntity> passengers = new ArrayList<>();

    static {
        passengers.add(new PassengerEntity(UUID.fromString("4c5c0000-97c6-fc34-a0cb-08db322230c0"), new Name("test-passenger"), new PassportNumber("123456789"), PassengerType.Male, new Age(30)));
    }
}
