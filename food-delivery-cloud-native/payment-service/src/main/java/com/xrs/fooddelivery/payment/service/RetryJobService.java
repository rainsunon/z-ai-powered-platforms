package com.xrs.fooddelivery.payment.service;

import com.xrs.fooddelivery.payment.entity.RetryJob;

import java.util.List;

public interface RetryJobService {
    RetryJob createRetryJob(String paymentId, String jobType, String jobData);
    void processPendingJobs();
    void markJobAsCompleted(String jobId);
    void markJobAsFailed(String jobId, String failureReason);
    List<RetryJob> getJobsByPaymentId(String paymentId);
}
