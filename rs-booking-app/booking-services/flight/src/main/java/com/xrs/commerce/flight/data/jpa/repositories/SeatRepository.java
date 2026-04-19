package com.xrs.commerce.flight.data.jpa.repositories;

import com.xrs.commerce.flight.data.jpa.entities.SeatEntity;
import com.xrs.commerce.flight.seats.valueobjects.FlightId;
import com.xrs.commerce.flight.seats.valueobjects.SeatNumber;
import jakarta.persistence.EntityManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;


@Repository
public interface SeatRepository extends JpaRepository<SeatEntity, UUID> {
  SeatEntity findSeatByIdAndIsDeletedFalse(UUID id);
  SeatEntity findSeatByFlightIdAndSeatNumberAndIsDeletedFalse(FlightId flightId, SeatNumber seatNumber);
}
