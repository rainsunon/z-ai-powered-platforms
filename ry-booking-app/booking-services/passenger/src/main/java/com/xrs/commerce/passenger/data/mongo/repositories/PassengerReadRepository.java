package com.xrs.commerce.passenger.data.mongo.repositories;

import com.xrs.commerce.passenger.data.mongo.documents.PassengerDocument;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.UUID;

public interface PassengerReadRepository extends MongoRepository<PassengerDocument, ObjectId> {
    PassengerDocument findPassengerByPassengerIdAndIsDeletedFalse(UUID passengerId);
}

