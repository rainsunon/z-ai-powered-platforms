package com.xrs.immo.domain.repository;

import com.xrs.immo.domain.model.PropertyViewEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PropertyViewEventRepository extends JpaRepository<PropertyViewEvent, String> {

    List<PropertyViewEvent> findByPropertyIdOrderByEventDateDesc(String propertyId);

    List<PropertyViewEvent> findByUserIdOrderByEventDateDesc(String userId);

    List<PropertyViewEvent> findByPropertyTypeAndEventDateBetween(
        String propertyType,
        LocalDateTime startDate,
        LocalDateTime endDate
    );

    @Query("SELECT COUNT(e) FROM PropertyViewEvent e WHERE e.propertyId = :propertyId AND e.eventDate >= :since")
    long countViewsByPropertyIdSince(@Param("propertyId") String propertyId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(DISTINCT e.userId) FROM PropertyViewEvent e WHERE e.propertyId = :propertyId AND e.eventDate >= :since")
    long countUniqueViewersByPropertyIdSince(@Param("propertyId") String propertyId, @Param("since") LocalDateTime since);

    @Query("SELECT e.propertyId, COUNT(e) as viewCount FROM PropertyViewEvent e " +
           "WHERE e.eventDate BETWEEN :startDate AND :endDate " +
           "GROUP BY e.propertyId ORDER BY viewCount DESC")
    List<Object[]> findMostViewedPropertiesBetween(@Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e.propertyType, COUNT(e) as viewCount FROM PropertyViewEvent e " +
           "WHERE e.eventDate BETWEEN :startDate AND :endDate " +
           "GROUP BY e.propertyType")
    List<Object[]> countViewsByPropertyTypeBetween(@Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate);

    @Query("SELECT DATE(e.eventDate) as viewDate, COUNT(e) as viewCount FROM PropertyViewEvent e " +
           "WHERE e.eventDate BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(e.eventDate) ORDER BY viewDate")
    List<Object[]> countViewsByDateBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
}
