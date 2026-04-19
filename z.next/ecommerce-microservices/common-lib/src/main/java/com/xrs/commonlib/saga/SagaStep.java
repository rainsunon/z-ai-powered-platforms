package com.xrs.commonlib.saga;

import reactor.core.publisher.Mono;

import java.util.function.Function;

/**
 * Represents a single step in a saga.
 * Each step has an action to execute and a compensation action to rollback.
 * 
 * @param <C> the context type shared across saga steps
 */
public class SagaStep<C> {
    
    private final String name;
    private final Function<C, Mono<Void>> action;
    private final Function<C, Mono<Void>> compensation;
    private final boolean critical;
    
    private SagaStep(String name, Function<C, Mono<Void>> action, 
                     Function<C, Mono<Void>> compensation, boolean critical) {
        this.name = name;
        this.action = action;
        this.compensation = compensation;
        this.critical = critical;
    }
    
    /**
     * Execute the step action.
     * 
     * @param context the saga context
     * @return a Mono that completes when the action is done
     */
    public Mono<Void> execute(C context) {
        return action.apply(context);
    }
    
    /**
     * Execute the compensation action.
     * 
     * @param context the saga context
     * @return a Mono that completes when compensation is done
     */
    public Mono<Void> compensate(C context) {
        if (compensation == null) {
            return Mono.empty();
        }
        return compensation.apply(context);
    }
    
    /**
     * Get the step name.
     * 
     * @return the step name
     */
    public String getName() {
        return name;
    }
    
    /**
     * Check if this step is critical.
     * Critical steps will fail the entire saga if they fail.
     * 
     * @return true if critical, false otherwise
     */
    public boolean isCritical() {
        return critical;
    }
    
    /**
     * Check if this step has a compensation action.
     * 
     * @return true if compensation exists, false otherwise
     */
    public boolean hasCompensation() {
        return compensation != null;
    }
    
    /**
     * Create a new saga step builder.
     * 
     * @param <C> the context type
     * @param name the step name
     * @return a new builder
     */
    public static <C> Builder<C> builder(String name) {
        return new Builder<>(name);
    }
    
    /**
     * Builder for creating SagaStep instances.
     */
    public static class Builder<C> {
        private final String name;
        private Function<C, Mono<Void>> action;
        private Function<C, Mono<Void>> compensation;
        private boolean critical = true;
        
        private Builder(String name) {
            this.name = name;
        }
        
        public Builder<C> action(Function<C, Mono<Void>> action) {
            this.action = action;
            return this;
        }
        
        public Builder<C> compensation(Function<C, Mono<Void>> compensation) {
            this.compensation = compensation;
            return this;
        }
        
        public Builder<C> critical(boolean critical) {
            this.critical = critical;
            return this;
        }
        
        public Builder<C> nonCritical() {
            this.critical = false;
            return this;
        }
        
        public SagaStep<C> build() {
            if (action == null) {
                throw new IllegalStateException("Action must be specified");
            }
            return new SagaStep<>(name, action, compensation, critical);
        }
    }
}
