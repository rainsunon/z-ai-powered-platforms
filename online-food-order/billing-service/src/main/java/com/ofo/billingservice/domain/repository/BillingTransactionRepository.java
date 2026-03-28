package com.ofo.billingservice.domain.repository;

import com.ofo.billingservice.domain.model.BillingTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BillingTransactionRepository extends JpaRepository<BillingTransaction, UUID> {

    Optional<BillingTransaction> findByRequestId(String requestId);

    Optional<BillingTransaction> findByOrderId(String orderId);

    List<BillingTransaction> findByUserIdOrderByCreatedAtDesc(String userId);

    @Query("SELECT bt FROM BillingTransaction bt WHERE bt.userId = :userId " +
           "AND bt.status = :status ORDER BY bt.createdAt DESC")
    List<BillingTransaction> findByUserIdAndStatus(
            @Param("userId") String userId,
            @Param("status") BillingTransaction.TransactionStatus status);

    @Query(value = "SELECT * FROM billing_transactions WHERE metadata->>'categorytype' = :category",
           nativeQuery = true)
    List<BillingTransaction> findByMetadataCategory(@Param("category") String category);

    @Query("SELECT bt FROM BillingTransaction bt WHERE bt.createdAt BETWEEN :startDate AND :endDate")
    List<BillingTransaction> findTransactionsInDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}

