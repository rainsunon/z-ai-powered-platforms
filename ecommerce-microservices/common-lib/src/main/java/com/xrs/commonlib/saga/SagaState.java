package com.xrs.commonlib.saga;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents the state of a saga execution.
 * Used for tracking saga progress and enabling recovery.
 * 
 * @param <C> the context type
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SagaState<C> {
    
    /**
     * Unique identifier for this saga execution.
     */
    private String sagaId;
    
    /**
     * Name of the saga.
     */
    private String sagaName;
    
    /**
     * Current step index being executed.
     */
    private int currentStep;
    
    /**
     * Status of the saga.
     */
    private SagaStatus status;
    
    /**
     * Saga context containing shared data.
     */
    private C context;
    
    /**
     * Error message if saga failed.
     */
    private String errorMessage;
    
    /**
     * Timestamp when the saga started.
     */
    private LocalDateTime startTime;
    
    /**
     * Timestamp when the saga ended (completed or failed).
     */
    private LocalDateTime endTime;
    
    /**
     * Check if the saga is in progress.
     */
    public boolean isInProgress() {
        return status == SagaStatus.IN_PROGRESS;
    }
    
    /**
     * Check if the saga is completed.
     */
    public boolean isCompleted() {
        return status == SagaStatus.COMPLETED;
    }
    
    /**
     * Check if the saga is compensating.
     */
    public boolean isCompensating() {
        return status == SagaStatus.COMPENSATING;
    }
    
    /**
     * Check if the saga is failed.
     */
    public boolean isFailed() {
        return status == SagaStatus.FAILED;
    }
    
    /**
     * Get the duration of the saga execution.
     */
    public long getDurationMillis() {
        if (startTime == null) {
            return 0;
        }
        LocalDateTime end = endTime != null ? endTime : LocalDateTime.now();
        return java.time.Duration.between(startTime, end).toMillis();
    }
}
