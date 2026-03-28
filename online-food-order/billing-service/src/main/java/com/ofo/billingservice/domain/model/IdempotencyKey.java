package com.ofo.billingservice.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Idempotency Key Entity for distributed transaction handling
 * Ensures exactly-once processing using CAP theorem (CP - Consistency + Partition tolerance)
 */
@Entity
@Table(name = "idempotency_keys", indexes = {
    @Index(name = "idx_request_id_unique", columnList = "request_id", unique = true),
    @Index(name = "idx_created_at_ttl", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdempotencyKey {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "request_id", unique = true, nullable = false)
    private String requestId;

    @Column(name = "resource_id")
    private String resourceId; // Transaction ID or result reference

    @Column(name = "status", nullable = false, length = 20)
    private String status; // PROCESSING, COMPLETED, FAILED

    @Column(name = "response_body", columnDefinition = "TEXT")
    private String responseBody; // Cached response for idempotent replay

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt; // TTL for cleanup

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (expiresAt == null) {
            expiresAt = createdAt.plusHours(24); // 24 hour TTL
        }
    }
}

