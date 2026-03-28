package com.xrs.commerce.flight.aircrafts.exceptions;

import buildingblocks.core.exception.ConflictException;

public class AircraftAlreadyExistException extends ConflictException {
  public AircraftAlreadyExistException() {
    super("Aircraft already exists!");
  }
}

