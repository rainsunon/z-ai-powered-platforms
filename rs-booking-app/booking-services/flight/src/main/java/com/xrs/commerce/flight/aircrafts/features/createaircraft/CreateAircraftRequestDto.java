package com.xrs.commerce.flight.aircrafts.features.createaircraft;

public record CreateAircraftRequestDto(
  String name,
  String model,
  int manufacturingYear){
}
