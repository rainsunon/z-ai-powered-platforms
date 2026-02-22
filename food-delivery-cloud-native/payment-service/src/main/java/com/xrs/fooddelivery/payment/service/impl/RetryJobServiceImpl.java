package com.xrs.fooddelivery.payment.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xrs.fooddelivery.payment.entity.RetryJob;
import com.xrs.fooddelivery.payment.repository.RetryJobRepository;
import com.xrs.fooddelivery.payment.service.RetryJobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RetryJobServiceImpl implements RetryJobService {
    private final RetryJobRepository retryJobRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public RetryJob createRetryJob(String paymentId, String jobType, String jobData) {
        String jobId = "JOB-" + UUID.randomUUID().toString().replace("-", "").toUpperCase();

        RetryJob retryJob = RetryJob.builder()
                .jobId(jobId)
                .jobType(jobType)
                .paymentId(paymentId)
                .status("PENDING")
                .retryCount(0)
                .maxRetries(3)
                .nextRetryAt(LocalDateTime.now().plusMinutes(1))
                .createdAt(LocalDateTime.now())
                .jobData(jobData)
                .build();

        return retryJobRepository.save(retryJob);
    }

    @Override
    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void processPendingJobs() {
        log.info("Processing pending retry jobs...");
        List<RetryJob> pendingJobs = retryJobRepository.findPendingJobsForRetry(LocalDateTime.now());

        for (RetryJob job : pendingJobs) {
            try {
                processJob(job);
            } catch (Exception e) {
                log.error("Error processing job {}: {}", job.getJobId(), e.getMessage(), e);
            }
        }

        log.info("Processed {} pending retry jobs", pendingJobs.size());
    }

    private void processJob(RetryJob job) {
        log.info("Processing retry job: {}, type: {}, paymentId: {}, retryCount: {}",
                job.getJobId(), job.getJobType(), job.getPaymentId(), job.getRetryCount());

        try {
            // Process the job based on type
            boolean success = executeJob(job);

            if (success) {
                markJobAsCompleted(job.getJobId());
            } else {
                handleJobFailure(job);
            }
        } catch (Exception e) {
            log.error("Job execution failed for {}: {}", job.getJobId(), e.getMessage(), e);
            handleJobFailure(job, e.getMessage());
        }
    }

    private boolean executeJob(RetryJob job) {
        // This is a placeholder for actual job execution logic
        // In a real implementation, this would:
        // 1. Parse jobData to understand what needs to be done
        // 2. Execute the appropriate action (e.g., retry webhook, retry capture)
        // 3. Return true if successful, false otherwise

        log.info("Executing job of type: {} for paymentId: {}", job.getJobType(), job.getPaymentId());

        // Simulate job execution
        // In production, this would call the appropriate service based on jobType
        return true;
    }

    private void handleJobFailure(RetryJob job) {
        handleJobFailure(job, "Job execution failed");
    }

    private void handleJobFailure(RetryJob job, String failureReason) {
        job.setRetryCount(job.getRetryCount() + 1);
        job.setLastAttemptedAt(LocalDateTime.now());
        job.setFailureReason(failureReason);

        if (job.getRetryCount() >= job.getMaxRetries()) {
            job.setStatus("FAILED");
            log.error("Job {} failed permanently after {} retries", job.getJobId(), job.getRetryCount());
        } else {
            job.setStatus("PENDING");
            // Exponential backoff: 1 min, 2 min, 4 min
            int delayMinutes = (int) Math.pow(2, job.getRetryCount());
            job.setNextRetryAt(LocalDateTime.now().plusMinutes(delayMinutes));
            log.info("Job {} will be retried in {} minutes", job.getJobId(), delayMinutes);
        }

        retryJobRepository.save(job);
    }

    @Override
    @Transactional
    public void markJobAsCompleted(String jobId) {
        RetryJob job = retryJobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        job.setStatus("COMPLETED");
        job.setCompletedAt(LocalDateTime.now());
        retryJobRepository.save(job);

        log.info("Job {} marked as completed", jobId);
    }

    @Override
    @Transactional
    public void markJobAsFailed(String jobId, String failureReason) {
        RetryJob job = retryJobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        job.setStatus("FAILED");
        job.setFailureReason(failureReason);
        job.setCompletedAt(LocalDateTime.now());
        retryJobRepository.save(job);

        log.error("Job {} marked as failed: {}", jobId, failureReason);
    }

    @Override
    public List<RetryJob> getJobsByPaymentId(String paymentId) {
        return retryJobRepository.findByPaymentIdOrderByCreatedAtDesc(paymentId);
    }
}
