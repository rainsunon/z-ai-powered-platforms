package com.xrs.fooddelivery.payment.repository;

import com.xrs.fooddelivery.payment.entity.RetryJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RetryJobRepository extends JpaRepository<RetryJob, Long> {
    Optional<RetryJob> findByJobId(String jobId);

    List<RetryJob> findByJobType(String jobType);

    List<RetryJob> findByStatus(String status);

    @Query("SELECT r FROM RetryJob r WHERE r.status = 'PENDING' AND r.nextRetryAt <= :now")
    List<RetryJob> findPendingJobsForRetry(@Param("now") LocalDateTime now);

    @Query("SELECT r FROM RetryJob r WHERE r.paymentId = :paymentId ORDER BY r.createdAt DESC")
    List<RetryJob> findByPaymentIdOrderByCreatedAtDesc(@Param("paymentId") String paymentId);

    @Query("SELECT r FROM RetryJob r WHERE r.jobType = :jobType AND r.status = 'PENDING' AND r.nextRetryAt <= :now")
    List<RetryJob> findPendingJobsByTypeForRetry(
        @Param("jobType") String jobType,
        @Param("now") LocalDateTime now
    );

    @Query("SELECT r FROM RetryJob r WHERE r.status = 'FAILED' AND r.retryCount >= r.maxRetries")
    List<RetryJob> findPermanentlyFailedJobs();
}
