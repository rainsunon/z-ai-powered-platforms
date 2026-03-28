package com.github.dimitryivaniuta.gateway.orders;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Simple business aggregate used to demonstrate the Transactional Outbox pattern.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class OrderEntity {

    /** Aggregate identifier. */
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    /** Customer email. */
    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    /** Order total amount. */
    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    /** Business status string (kept flexible, no DB enum constraints). */
    @Column(name = "status", nullable = false)
    private String status;

    /** Creation timestamp (UTC). */
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
