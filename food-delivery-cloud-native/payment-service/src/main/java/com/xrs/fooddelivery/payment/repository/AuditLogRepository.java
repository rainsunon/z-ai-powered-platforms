package com.xrs.fooddelivery.payment.repository;

import com.xrs.fooddelivery.payment.audit.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByPaymentId(String paymentId);

    List<AuditLog> findByEventType(String eventType);

    @Query("SELECT a FROM AuditLog a WHERE a.paymentId = :paymentId ORDER BY a.timestamp DESC")
    List<AuditLog> findByPaymentIdOrderByTimestampDesc(@Param("paymentId") String paymentId);

    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT a FROM AuditLog a WHERE a.merchantId = :merchantId AND a.timestamp BETWEEN :startDate AND :endDate")
    List<AuditLog> findByMerchantIdAndDateRange(
        @Param("merchantId") Long merchantId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
