package com.xrs.commerce.booking.data.jpa.repositories;

import com.xrs.commerce.booking.data.jpa.entities.BookingEntity;
import jakarta.persistence.EntityManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;


@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, UUID> {
   BookingEntity findBookingByIdAndIsDeletedFalse(UUID id);
}
