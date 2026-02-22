package com.xrs.fooddelivery.payment.audit;

import com.xrs.fooddelivery.payment.dto.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_payment_id", columnList = "paymentId"),
    @Index(name = "idx_audit_event_type", columnList = "eventType"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String paymentId;

    @Column(nullable = false, length = 50)
    private String eventType;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentStatus status;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Long merchantId;

    @Column(nullable = false)
    private Long orderId;

    @Column(precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(length = 100)
    private String authId;

    @Column(length = 100)
    private String captureId;

    @Column(length = 500)
    private String failureReason;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String eventData;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 50)
    private String source;

    @Column(length = 500)
    private String additionalInfo;
}
