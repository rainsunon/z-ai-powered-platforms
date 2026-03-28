package com.xrs.commerce.flight.data.jpa.repositories;

import com.xrs.commerce.flight.data.jpa.entities.FlightEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;

import java.util.UUID;

@Repository
public interface FlightRepository extends JpaRepository<FlightEntity, UUID> {
  FlightEntity findFlightByIdAndIsDeletedFalse(UUID id);
}
