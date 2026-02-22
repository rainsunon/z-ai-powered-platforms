package com.xrs.fooddelivery.payment.repository;

import com.xrs.fooddelivery.payment.merchant.MerchantPaymentSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MerchantPaymentSummaryRepository extends JpaRepository<MerchantPaymentSummary, Long> {
    List<MerchantPaymentSummary> findByMerchantId(Long merchantId);

    List<MerchantPaymentSummary> findByMerchantIdOrderByCreatedAtDesc(Long merchantId);

    @Query("SELECT m FROM MerchantPaymentSummary m WHERE m.merchantId = :merchantId AND m.status = :status")
    List<MerchantPaymentSummary> findByMerchantIdAndStatus(
        @Param("merchantId") Long merchantId,
        @Param("status") com.xrs.fooddelivery.payment.dto.PaymentStatus status
    );

    @Query("SELECT m FROM MerchantPaymentSummary m WHERE m.merchantId = :merchantId AND m.createdAt BETWEEN :startDate AND :endDate")
    List<MerchantPaymentSummary> findByMerchantIdAndDateRange(
        @Param("merchantId") Long merchantId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COALESCE(SUM(m.amount), 0) FROM MerchantPaymentSummary m WHERE m.merchantId = :merchantId AND m.status = :status")
    BigDecimal sumAmountByMerchantIdAndStatus(
        @Param("merchantId") Long merchantId,
        @Param("status") com.xrs.fooddelivery.payment.dto.PaymentStatus status
    );

    @Query("SELECT COUNT(m) FROM MerchantPaymentSummary m WHERE m.merchantId = :merchantId AND m.status = :status")
    Long countByMerchantIdAndStatus(
        @Param("merchantId") Long merchantId,
        @Param("status") com.xrs.fooddelivery.payment.dto.PaymentStatus status
    );
}
