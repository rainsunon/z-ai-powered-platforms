package com.xrs.commerce.booking.bookings.valueobjects;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@EqualsAndHashCode
@NoArgsConstructor // Required by JPA
@Getter
public class PassengerInfo {
    private String name;

    public PassengerInfo(String name) {
        ValidationUtils.notBeNullOrEmpty(name);

        this.name = name;
    }
}
