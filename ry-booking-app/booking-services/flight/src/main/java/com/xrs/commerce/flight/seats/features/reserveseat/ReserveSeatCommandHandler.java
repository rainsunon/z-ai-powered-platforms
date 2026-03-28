package com.xrs.commerce.flight.seats.features.reserveseat;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import com.xrs.commerce.flight.data.jpa.entities.SeatEntity;
import com.xrs.commerce.flight.data.jpa.repositories.SeatRepository;
import com.xrs.commerce.flight.seats.dtos.SeatDto;
import com.xrs.commerce.flight.seats.exceptions.SeatNumberAlreadyReservedException;
import com.xrs.commerce.flight.seats.features.Mappings;
import com.xrs.commerce.flight.seats.models.Seat;
import com.xrs.commerce.flight.seats.valueobjects.FlightId;
import com.xrs.commerce.flight.seats.valueobjects.SeatNumber;
import org.springframework.stereotype.Service;


@Service
public class ReserveSeatCommandHandler implements ICommandHandler<ReserveSeatCommand, SeatDto> {
  private final SeatRepository seatRepository;

  public ReserveSeatCommandHandler(SeatRepository seatRepository) {
    this.seatRepository = seatRepository;
  }

  @Override
  public SeatDto handle(ReserveSeatCommand command) {
    SeatEntity existSeat = seatRepository.findSeatByFlightIdAndSeatNumberAndIsDeletedFalse(new FlightId(command.flightId()), new SeatNumber(command.seatNumber()));

    if (existSeat == null) {
         throw new SeatNumberAlreadyReservedException();
    }

    Seat seat = Mappings.toSeatAggregate(existSeat);

    seat.reserveSeat();

    SeatEntity seatEntity = Mappings.toSeatEntity(seat);
    SeatEntity seatUpdated = seatRepository.save(seatEntity);

    return Mappings.toSeatDto(seatUpdated);
  }
}
