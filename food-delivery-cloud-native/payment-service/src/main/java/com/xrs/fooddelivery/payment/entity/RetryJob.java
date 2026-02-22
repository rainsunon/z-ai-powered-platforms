package com.xrs.fooddelivery.payment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "retry_jobs", indexes = {
    @Index(name = "idx_job_type", columnList = "jobType"),
    @Index(name = "idx_payment_id", columnList = "paymentId"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_next_retry_at", columnList = "nextRetryAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RetryJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String jobId;

    @Column(nullable = false, length = 50)
    private String jobType;

    @Column(nullable = false, length = 100)
    private String paymentId;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false)
    private Integer retryCount;

    @Column(nullable = false)
    private Integer maxRetries;

    @Column
    private LocalDateTime nextRetryAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime lastAttemptedAt;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String jobData;

    @Column(length = 500)
    private String failureReason;

    @Column
    private LocalDateTime completedAt;
}
