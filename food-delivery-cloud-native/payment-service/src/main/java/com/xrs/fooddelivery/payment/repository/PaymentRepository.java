package com.xrs.fooddelivery.payment.repository;

import com.xrs.fooddelivery.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentId(String paymentId);

    List<Payment> findByMerchantId(Long merchantId);

    List<Payment> findByCustomerId(Long customerId);

    List<Payment> findByOrderId(Long orderId);

    List<Payment> findByStatus(com.xrs.fooddelivery.payment.dto.PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByStatusAndDateRange(
        @Param("status") com.xrs.fooddelivery.payment.dto.PaymentStatus status,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT p FROM Payment p WHERE p.merchantId = :merchantId AND p.status = :status")
    List<Payment> findByMerchantIdAndStatus(
        @Param("merchantId") Long merchantId,
        @Param("status") com.xrs.fooddelivery.payment.dto.PaymentStatus status
    );
}
