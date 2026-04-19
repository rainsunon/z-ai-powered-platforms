package com.xrs.commonlib.saga;

/**
 * Enumeration of possible saga statuses.
 */
public enum SagaStatus {
    
    /**
     * Saga is currently executing.
     */
    IN_PROGRESS,
    
    /**
     * Saga has completed successfully.
     */
    COMPLETED,
    
    /**
     * Saga is compensating (rolling back).
     */
    COMPENSATING,
    
    /**
     * Saga has failed.
     */
    FAILED,
    
    /**
     * Saga has been cancelled.
     */
    CANCELLED
}
