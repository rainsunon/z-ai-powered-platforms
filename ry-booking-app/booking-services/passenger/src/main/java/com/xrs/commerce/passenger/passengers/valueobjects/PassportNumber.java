package com.xrs.commerce.passenger.passengers.valueobjects;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@EqualsAndHashCode
@NoArgsConstructor // Required by JPA
@Getter
public class PassportNumber {
    private String passportNumber;

    public PassportNumber(String value) {
        ValidationUtils.notBeNullOrEmpty(value);

        this.passportNumber = value;
    }
}


