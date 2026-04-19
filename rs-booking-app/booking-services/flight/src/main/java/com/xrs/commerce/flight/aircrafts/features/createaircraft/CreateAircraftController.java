package com.xrs.commerce.flight.aircrafts.features.createaircraft;

import buildingblocks.mediator.abstractions.IMediator;
import com.xrs.commerce.flight.aircrafts.dtos.AircraftDto;
import com.xrs.commerce.flight.aircrafts.features.Mappings;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/flight/aircraft")
@Tag(name = "flight")
public class CreateAircraftController {

  private final IMediator mediator;

  public CreateAircraftController(IMediator mediator) {
    this.mediator = mediator;
  }

  @PostMapping()
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<AircraftDto> createAircraft(@RequestBody CreateAircraftRequestDto createAircraftRequestDto) {
    CreateAircraftCommand command = Mappings.toCreateAircraftCommand(createAircraftRequestDto);
    var result = this.mediator.send(command);
    return ResponseEntity.ok().body(result);
  }
}


