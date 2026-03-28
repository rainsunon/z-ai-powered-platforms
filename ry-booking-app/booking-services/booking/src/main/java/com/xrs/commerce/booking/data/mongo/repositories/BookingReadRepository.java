package com.xrs.commerce.booking.data.mongo.repositories;

import com.xrs.commerce.booking.data.mongo.documents.BookingDocument;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.UUID;


public interface BookingReadRepository extends MongoRepository<BookingDocument, ObjectId> {
    BookingDocument findBookingByBookingIdAndIsDeletedFalse(UUID bookingId);
}

