package com.xrs.commerce.flight.airports.features;

import com.github.f4b6a3.uuid.UuidCreator;
import com.xrs.commerce.flight.airports.dtos.AirportDto;
import com.xrs.commerce.flight.airports.features.createairport.CreateAirportCommand;
import com.xrs.commerce.flight.airports.features.createairport.CreateAirportMongoCommand;
import com.xrs.commerce.flight.airports.features.createairport.CreateAirportRequestDto;
import com.xrs.commerce.flight.airports.models.Airport;
import com.xrs.commerce.flight.data.jpa.entities.AirportEntity;
import com.xrs.commerce.flight.data.mongo.documents.AirportDocument;

public final class Mappings {

  public static AirportEntity toAirportEntity(Airport airport) {
    return new AirportEntity(
      airport.getId().getAirportId(),
      airport.getName(),
      airport.getCode(),
      airport.getAddress(),
      airport.getCreatedAt(),
      airport.getCreatedBy(),
      airport.getLastModified(),
      airport.getLastModifiedBy(),
      airport.getVersion(),
      airport.isDeleted()
    );
  }


  public static AirportDto toAirportDto(AirportEntity airportEntity) {
    return new AirportDto(
      airportEntity.getId(),
      airportEntity.getName().getName(),
      airportEntity.getCode().getCode(),
      airportEntity.getAddress().getAddress());
  }

  public static CreateAirportCommand toCreateAirportCommand(CreateAirportRequestDto createAirportRequestDto) {
    return new CreateAirportCommand(
      UuidCreator.getTimeOrderedEpoch(),
      createAirportRequestDto.name(),
      createAirportRequestDto.code(),
      createAirportRequestDto.address()
    );
  }

  public static AirportDocument toAirportDocument(CreateAirportMongoCommand createAirportMongoCommand) {
    return new AirportDocument(
      createAirportMongoCommand.id(),
      createAirportMongoCommand.name(),
      createAirportMongoCommand.code(),
      createAirportMongoCommand.address(),
      createAirportMongoCommand.isDeleted()
    );
  }

  public static AirportDocument toAirportDocument(AirportEntity airportEntity) {
    return new AirportDocument(
      airportEntity.getId(),
      airportEntity.getName().getName(),
      airportEntity.getCode().getCode(),
      airportEntity.getAddress().getAddress(),
      airportEntity.isDeleted()
    );
  }
}
