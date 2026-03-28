package com.ofo.billingservice.application.service;

import com.ofo.billingservice.domain.event.OrderPaidEvent;
import com.ofo.billingservice.domain.model.BillingTransaction;
import com.ofo.billingservice.domain.model.IdempotencyKey;
import com.ofo.billingservice.domain.repository.BillingTransactionRepository;
import com.ofo.billingservice.domain.repository.IdempotencyKeyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Billing Service - Application Layer
 * Implements idempotent billing transaction processing with CAP considerations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BillingService {

    private final BillingTransactionRepository transactionRepository;
    private final IdempotencyKeyRepository idempotencyKeyRepository;

    /**
     * Process billing transaction with idempotency guarantee
     * Uses optimistic locking and unique constraint on request_id
     */
    @Transactional
    public BillingTransaction processBillingTransaction(OrderPaidEvent event) {
        String requestId = event.getRequestId();

        // Check idempotency - return cached result if already processed
        Optional<IdempotencyKey> existingKey = idempotencyKeyRepository.findByRequestId(requestId);
        if (existingKey.isPresent() && "COMPLETED".equals(existingKey.get().getStatus())) {
            log.info("Duplicate event detected, returning cached result: requestId={}", requestId);
            String resourceId = existingKey.get().getResourceId();
            return transactionRepository.findById(UUID.fromString(resourceId))
                    .orElseThrow(() -> new IllegalStateException("Cached transaction not found"));
        }

        // Check if transaction already exists by order_id
        Optional<BillingTransaction> existing = transactionRepository.findByOrderId(event.getOrderId());
        if (existing.isPresent()) {
            log.warn("Transaction already exists for orderId={}, skipping", event.getOrderId());
            return existing.get();
        }

        // Create idempotency key with PROCESSING status
        IdempotencyKey idempotencyKey = IdempotencyKey.builder()
                .requestId(requestId)
                .status("PROCESSING")
                .build();
        idempotencyKeyRepository.save(idempotencyKey);

        try {
            // Create billing transaction with JSONB metadata
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("paymentId", event.getPaymentId());
            metadata.put("paidAt", event.getPaidAt().toString());
            metadata.put("source", "order-payment");

            BillingTransaction transaction = BillingTransaction.builder()
                    .requestId(requestId)
                    .orderId(event.getOrderId())
                    .userId(event.getUserId())
                    .amount(event.getAmount())
                    .currency(event.getCurrency())
                    .status(BillingTransaction.TransactionStatus.PROCESSING)
                    .type(BillingTransaction.TransactionType.CHARGE)
                    .metadata(metadata)
                    .build();

            transaction = transactionRepository.save(transaction);

            // Simulate billing processing logic
            transaction.setStatus(BillingTransaction.TransactionStatus.COMPLETED);
            transaction.setProcessedAt(LocalDateTime.now());
            transaction = transactionRepository.save(transaction);

            // Update idempotency key to COMPLETED
            idempotencyKey.setResourceId(transaction.getTransactionId().toString());
            idempotencyKey.setStatus("COMPLETED");
            idempotencyKey.setResponseBody(String.format("{\"transactionId\":\"%s\"}", transaction.getTransactionId()));
            idempotencyKeyRepository.save(idempotencyKey);

            log.info("Billing transaction created: transactionId={}, orderId={}",
                    transaction.getTransactionId(), event.getOrderId());

            return transaction;

        } catch (Exception e) {
            // Mark as FAILED
            idempotencyKey.setStatus("FAILED");
            idempotencyKeyRepository.save(idempotencyKey);
            throw new RuntimeException("Failed to process billing transaction", e);
        }
    }
}

