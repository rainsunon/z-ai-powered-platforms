package com.xrs.commonlib.saga;

/**
 * Enumeration of possible saga event types.
 */
public enum SagaEventType {
    
    /**
     * Saga has started execution.
     */
    SAGA_STARTED,
    
    /**
     * Saga has completed successfully.
     */
    SAGA_COMPLETED,
    
    /**
     * Saga has failed.
     */
    SAGA_FAILED,
    
    /**
     * A step has started execution.
     */
    STEP_STARTED,
    
    /**
     * A step has completed successfully.
     */
    STEP_COMPLETED,
    
    /**
     * A step has failed.
     */
    STEP_FAILED,
    
    /**
     * Compensation has started for a step.
     */
    COMPENSATION_STARTED,
    
    /**
     * Compensation has completed for a step.
     */
    COMPENSATION_COMPLETED,
    
    /**
     * Compensation has failed for a step.
     */
    COMPENSATION_FAILED
}
