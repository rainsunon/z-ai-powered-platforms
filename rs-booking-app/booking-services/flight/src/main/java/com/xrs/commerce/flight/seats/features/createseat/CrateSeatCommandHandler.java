package com.xrs.commerce.flight.seats.features.createseat;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import com.xrs.commerce.flight.data.jpa.entities.SeatEntity;
import com.xrs.commerce.flight.data.jpa.repositories.SeatRepository;
import com.xrs.commerce.flight.seats.dtos.SeatDto;
import com.xrs.commerce.flight.seats.exceptions.SeatAlreadyExistException;
import com.xrs.commerce.flight.seats.features.Mappings;
import com.xrs.commerce.flight.seats.models.Seat;
import com.xrs.commerce.flight.seats.valueobjects.FlightId;
import com.xrs.commerce.flight.seats.valueobjects.SeatId;
import com.xrs.commerce.flight.seats.valueobjects.SeatNumber;
import org.springframework.stereotype.Service;

@Service
public class CrateSeatCommandHandler implements ICommandHandler<CreateSeatCommand, SeatDto> {

  private final SeatRepository seatRepository;

  public CrateSeatCommandHandler(SeatRepository seatRepository) {
    this.seatRepository = seatRepository;
  }

  @Override
  public SeatDto handle(CreateSeatCommand command) {

    SeatEntity existSeat = seatRepository.findSeatByIdAndIsDeletedFalse(command.id());
    if (existSeat!= null) {
      throw new SeatAlreadyExistException();
    }

    Seat seat = Seat.create(
      new SeatId(command.id()),
      new SeatNumber(command.seatNumber()),
      command.seatType(),
      command.seatClass(),
      new FlightId(command.flightId())
    );

    SeatEntity seatEntity = Mappings.toSeatEntity(seat);

    SeatEntity seatCreated = seatRepository.save(seatEntity);
    return Mappings.toSeatDto(seatCreated);
  }
}
