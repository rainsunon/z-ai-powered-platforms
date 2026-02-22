package com.xrs.commonlib.saga;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents an event that occurs during saga execution.
 * 
 * @param <C> the context type
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SagaEvent<C> {
    
    /**
     * Type of the event.
     */
    private SagaEventType type;
    
    /**
     * Name of the saga.
     */
    private String sagaName;
    
    /**
     * Name of the step (if applicable).
     */
    private String stepName;
    
    /**
     * Step index (if applicable).
     */
    private Integer stepIndex;
    
    /**
     * Saga context.
     */
    private C context;
    
    /**
     * Error message (if applicable).
     */
    private String errorMessage;
    
    /**
     * Timestamp when the event occurred.
     */
    private LocalDateTime timestamp;
    
    /**
     * Create a saga started event.
     */
    public static <C> SagaEvent<C> started(String sagaName, C context) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.SAGA_STARTED)
                .sagaName(sagaName)
                .context(context)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Create a saga completed event.
     */
    public static <C> SagaEvent<C> completed(String sagaName, C context) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.SAGA_COMPLETED)
                .sagaName(sagaName)
                .context(context)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Create a saga failed event.
     */
    public static <C> SagaEvent<C> failed(String sagaName, C context, Throwable error) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.SAGA_FAILED)
                .sagaName(sagaName)
                .context(context)
                .errorMessage(error.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Create a step started event.
     */
    public static <C> SagaEvent<C> stepStarted(String sagaName, String stepName, int stepIndex, C context) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.STEP_STARTED)
                .sagaName(sagaName)
                .stepName(stepName)
                .stepIndex(stepIndex)
                .context(context)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Create a step completed event.
     */
    public static <C> SagaEvent<C> stepCompleted(String sagaName, String stepName, int stepIndex, C context) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.STEP_COMPLETED)
                .sagaName(sagaName)
                .stepName(stepName)
                .stepIndex(stepIndex)
                .context(context)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Create a step failed event.
     */
    public static <C> SagaEvent<C> stepFailed(String sagaName, String stepName, int stepIndex, C context, Throwable error) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.STEP_FAILED)
                .sagaName(sagaName)
                .stepName(stepName)
                .stepIndex(stepIndex)
                .context(context)
                .errorMessage(error.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Create a compensation started event.
     */
    public static <C> SagaEvent<C> compensationStarted(String sagaName, String stepName, int stepIndex, C context) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.COMPENSATION_STARTED)
                .sagaName(sagaName)
                .stepName(stepName)
                .stepIndex(stepIndex)
                .context(context)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Create a compensation completed event.
     */
    public static <C> SagaEvent<C> compensationCompleted(String sagaName, String stepName, int stepIndex, C context) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.COMPENSATION_COMPLETED)
                .sagaName(sagaName)
                .stepName(stepName)
                .stepIndex(stepIndex)
                .context(context)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Create a compensation failed event.
     */
    public static <C> SagaEvent<C> compensationFailed(String sagaName, String stepName, int stepIndex, C context, Throwable error) {
        return SagaEvent.<C>builder()
                .type(SagaEventType.COMPENSATION_FAILED)
                .sagaName(sagaName)
                .stepName(stepName)
                .stepIndex(stepIndex)
                .context(context)
                .errorMessage(error.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }
}
