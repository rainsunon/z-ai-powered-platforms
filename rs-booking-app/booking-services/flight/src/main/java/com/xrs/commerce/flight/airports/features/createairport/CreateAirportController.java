package com.xrs.commerce.flight.airports.features.createairport;

import buildingblocks.mediator.abstractions.IMediator;
import com.xrs.commerce.flight.airports.dtos.AirportDto;
import com.xrs.commerce.flight.airports.features.Mappings;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(path = "api/v1/flight/airport")
@Tag(name = "flight")
public class CreateAirportController {

  private final IMediator mediator;

  public CreateAirportController(IMediator mediator) {
    this.mediator = mediator;
  }

  @PostMapping()
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<AirportDto> createAirport(@RequestBody CreateAirportRequestDto createAirportRequestDto) {
    CreateAirportCommand command = Mappings.toCreateAirportCommand(createAirportRequestDto);
    var result = this.mediator.send(command);
    return ResponseEntity.ok().body(result);
  }
}

