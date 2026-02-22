package com.xrs.commonlib.saga;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

/**
 * SagaOrchestrator coordinates the execution of saga steps.
 * Implements the saga pattern for distributed transactions.
 * 
 * @param <C> the context type shared across saga steps
 */
@Slf4j
public class SagaOrchestrator<C> {
    
    private final String sagaName;
    private final List<SagaStep<C>> steps;
    private final SagaStateRepository<C> stateRepository;
    private final SagaEventListener<C> eventListener;
    
    private SagaOrchestrator(String sagaName, List<SagaStep<C>> steps,
                            SagaStateRepository<C> stateRepository,
                            SagaEventListener<C> eventListener) {
        this.sagaName = sagaName;
        this.steps = new ArrayList<>(steps);
        this.stateRepository = stateRepository;
        this.eventListener = eventListener;
    }
    
    /**
     * Execute the saga with the given context.
     * 
     * @param context the saga context
     * @return a Mono that completes when the saga is done
     */
    public Mono<Void> execute(C context) {
        return execute(context, 0);
    }
    
    /**
     * Execute the saga starting from a specific step.
     * 
     * @param context the saga context
     * @param startIndex the step index to start from
     * @return a Mono that completes when the saga is done
     */
    private Mono<Void> execute(C context, int startIndex) {
        if (startIndex >= steps.size()) {
            log.info("Saga {} completed successfully", sagaName);
            notifyEvent(SagaEvent.completed(sagaName, context));
            return Mono.empty();
        }
        
        SagaStep<C> step = steps.get(startIndex);
        log.info("Executing saga step: {} (step {}/{})", step.getName(), startIndex + 1, steps.size());
        
        // Save saga state before executing step
        return stateRepository.saveState(createSagaState(context, startIndex, SagaStatus.IN_PROGRESS))
                .then(notifyEvent(SagaEvent.stepStarted(sagaName, step.getName(), startIndex, context)))
                .then(step.execute(context))
                .then(notifyEvent(SagaEvent.stepCompleted(sagaName, step.getName(), startIndex, context)))
                .then(execute(context, startIndex + 1))
                .onErrorResume(error -> {
                    log.error("Saga step {} failed: {}", step.getName(), error.getMessage());
                    
                    // Check if step is critical
                    if (step.isCritical()) {
                        log.info("Critical step failed, starting compensation");
                        return compensate(context, startIndex - 1, error);
                    } else {
                        log.info("Non-critical step failed, continuing with next step");
                        return execute(context, startIndex + 1);
                    }
                });
    }
    
    /**
     * Compensate completed steps in reverse order.
     * 
     * @param context the saga context
     * @param startIndex the step index to start compensating from
     * @param error the error that triggered compensation
     * @return a Mono that completes when compensation is done
     */
    private Mono<Void> compensate(C context, int startIndex, Throwable error) {
        if (startIndex < 0) {
            log.error("Saga {} failed after compensating all steps", sagaName);
            notifyEvent(SagaEvent.failed(sagaName, context, error));
            return Mono.error(error);
        }
        
        SagaStep<C> step = steps.get(startIndex);
        
        if (!step.hasCompensation()) {
            log.warn("Step {} has no compensation, skipping", step.getName());
            return compensate(context, startIndex - 1, error);
        }
        
        log.info("Compensating step: {}", step.getName());
        
        return notifyEvent(SagaEvent.compensationStarted(sagaName, step.getName(), startIndex, context))
                .then(step.compensate(context))
                .then(notifyEvent(SagaEvent.compensationCompleted(sagaName, step.getName(), startIndex, context)))
                .then(compensate(context, startIndex - 1, error))
                .onErrorResume(compError -> {
                    log.error("Compensation for step {} failed: {}", step.getName(), compError.getMessage());
                    // Continue compensating other steps even if one fails
                    return compensate(context, startIndex - 1, error);
                });
    }
    
    /**
     * Create a saga state object.
     */
    private SagaState<C> createSagaState(C context, int currentStep, SagaStatus status) {
        return SagaState.<C>builder()
                .sagaId(generateSagaId(context))
                .sagaName(sagaName)
                .currentStep(currentStep)
                .status(status)
                .context(context)
                .build();
    }
    
    /**
     * Generate a unique saga ID.
     */
    private String generateSagaId(C context) {
        return sagaName + "-" + System.currentTimeMillis();
    }
    
    /**
     * Notify event listener of saga events.
     */
    private Mono<Void> notifyEvent(SagaEvent<C> event) {
        if (eventListener != null) {
            return eventListener.onEvent(event);
        }
        return Mono.empty();
    }
    
    /**
     * Create a new saga orchestrator builder.
     * 
     * @param <C> the context type
     * @param sagaName the saga name
     * @return a new builder
     */
    public static <C> Builder<C> builder(String sagaName) {
        return new Builder<>(sagaName);
    }
    
    /**
     * Builder for creating SagaOrchestrator instances.
     */
    public static class Builder<C> {
        private final String sagaName;
        private final List<SagaStep<C>> steps = new ArrayList<>();
        private SagaStateRepository<C> stateRepository;
        private SagaEventListener<C> eventListener;
        
        private Builder(String sagaName) {
            this.sagaName = sagaName;
        }
        
        public Builder<C> addStep(SagaStep<C> step) {
            steps.add(step);
            return this;
        }
        
        public Builder<C> stateRepository(SagaStateRepository<C> stateRepository) {
            this.stateRepository = stateRepository;
            return this;
        }
        
        public Builder<C> eventListener(SagaEventListener<C> eventListener) {
            this.eventListener = eventListener;
            return this;
        }
        
        public SagaOrchestrator<C> build() {
            if (steps.isEmpty()) {
                throw new IllegalStateException("At least one step must be added");
            }
            return new SagaOrchestrator<>(sagaName, steps, stateRepository, eventListener);
        }
    }
}
