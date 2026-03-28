package com.xrs.commerce.booking.bookings.features.createbooking;

import buildingblocks.mediator.abstractions.commands.ICommandHandler;
import buildingblocks.mediator.abstractions.requests.Unit;
import com.xrs.commerce.booking.bookings.exceptions.BookingAlreadyExistException;
import com.xrs.commerce.booking.bookings.features.Mappings;
import com.xrs.commerce.booking.data.mongo.documents.BookingDocument;
import com.xrs.commerce.booking.data.mongo.repositories.BookingReadRepository;
import org.springframework.stereotype.Service;

@Service
public class CreateBookingMongoCommandHandler implements ICommandHandler<CreateBookingMongoCommand, Unit> {
    private final BookingReadRepository bookingReadRepository;

    public CreateBookingMongoCommandHandler(BookingReadRepository bookingReadRepository) {
        this.bookingReadRepository = bookingReadRepository;
    }

    @Override
    public Unit handle(CreateBookingMongoCommand command) {

        BookingDocument existBooking = bookingReadRepository.findBookingByBookingIdAndIsDeletedFalse(command.id());
        if (existBooking != null) {
            throw new BookingAlreadyExistException();
        }

        BookingDocument bookingDocument = Mappings.toBookingDocument(command);

        bookingReadRepository.save(bookingDocument);

        return Unit.VALUE;
    }
}
