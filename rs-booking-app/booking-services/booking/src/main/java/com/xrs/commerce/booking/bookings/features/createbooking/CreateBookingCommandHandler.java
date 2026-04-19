package com.xrs.commerce.booking.bookings.features.createbooking;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import buildingblocks.utils.protobuf.ProtobufUtils;
import flight.Flight;
import flight.FlightServiceGrpc;
import com.xrs.commerce.booking.bookings.dtos.BookingDto;
import com.xrs.commerce.booking.bookings.exceptions.BookingAlreadyExistException;
import com.xrs.commerce.booking.bookings.exceptions.FlightNotFoundException;
import com.xrs.commerce.booking.bookings.exceptions.PassengerNotFoundException;
import com.xrs.commerce.booking.bookings.exceptions.SeatNumberIsNotAvailableException;
import com.xrs.commerce.booking.bookings.features.Mappings;
import com.xrs.commerce.booking.bookings.modles.Booking;
import com.xrs.commerce.booking.bookings.valueobjects.BookingId;
import com.xrs.commerce.booking.bookings.valueobjects.PassengerInfo;
import com.xrs.commerce.booking.bookings.valueobjects.Trip;
import com.xrs.commerce.booking.data.jpa.entities.BookingEntity;
import com.xrs.commerce.booking.data.jpa.repositories.BookingRepository;
import org.springframework.stereotype.Service;
import passenger.Passenger;
import passenger.PassengerServiceGrpc;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

import static com.xrs.commerce.booking.bookings.features.Mappings.*;

@Service
public class CreateBookingCommandHandler implements ICommandHandler<CreateBookingCommand, BookingDto> {

    private final FlightServiceGrpc.FlightServiceBlockingStub flightServiceBlockingStub;
    private final PassengerServiceGrpc.PassengerServiceBlockingStub passengerServiceBlockingStub;
    private final BookingRepository bookingRepository;

    public CreateBookingCommandHandler(
            FlightServiceGrpc.FlightServiceBlockingStub flightServiceBlockingStub,
            PassengerServiceGrpc.PassengerServiceBlockingStub passengerServiceBlockingStub,
            BookingRepository bookingRepository) {
        this.flightServiceBlockingStub = flightServiceBlockingStub;
        this.passengerServiceBlockingStub = passengerServiceBlockingStub;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public BookingDto handle(CreateBookingCommand command) {

       Flight.GetByIdRequestDto.newBuilder().setId(command.flightId().toString()).build();

        Flight.FlightResponseDto flight = flightServiceBlockingStub.getById(toFlightGetByIdRequestDto(command));

        if (flight == null)
        {
            throw new FlightNotFoundException();
        }

        Passenger.PassengerResponseDto passenger = passengerServiceBlockingStub.getById(toPassengerGetByIdRequestDto(command));

        if (passenger == null){
            throw new PassengerNotFoundException();
        }

        Flight.SeatResponseDto emptySeat = flightServiceBlockingStub.getAvailableSeats(toGetAvailableSeatsResponseDto(command)).getSeatsDtoList().stream().findAny().orElse(null);

        if(emptySeat == null){
            throw new SeatNumberIsNotAvailableException();
        }

        var existBooking = bookingRepository.findBookingByIdAndIsDeletedFalse(command.flightId());

        if(existBooking != null){
            throw new BookingAlreadyExistException();
        }

       Booking booking = Booking.create(new BookingId(command.id()), new PassengerInfo(passenger.getName()), new Trip(flight.getFlightNumber(),
                UUID.fromString(flight.getAircraftId()), UUID.fromString(flight.getDepartureAirportId()),
                UUID.fromString(flight.getArriveAirportId()), ProtobufUtils.toLocalDateTime(flight.getFlightDate()),
                BigDecimal.ONE, command.description(), Objects.requireNonNull(emptySeat).getSeatNumber()));

        flightServiceBlockingStub.reserveSeat(toReserveSeatRequestDto(flight.getId(), emptySeat.getSeatNumber()));

        BookingEntity bookingEntity = Mappings.toBookingEntity(booking);
        BookingEntity createdBooking = bookingRepository.save(bookingEntity);

        return toBookingDto(createdBooking);
    }
}
