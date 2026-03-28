package com.xrs.commerce.flight.data.jpa.repositories;

import com.xrs.commerce.flight.data.jpa.entities.AirportEntity;
import jakarta.persistence.EntityManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;


@Repository
public interface AirportRepository extends JpaRepository<AirportEntity, UUID> {
  AirportEntity findAirportByCodeAndIsDeletedFalse(String code);
}
