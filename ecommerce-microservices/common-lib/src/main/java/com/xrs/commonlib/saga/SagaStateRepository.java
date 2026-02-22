package com.xrs.commonlib.saga;

import reactor.core.publisher.Mono;

import java.util.Optional;

/**
 * Repository interface for storing and retrieving saga states.
 * Implementations can use in-memory storage, database, or other mechanisms.
 * 
 * @param <C> the context type
 */
public interface SagaStateRepository<C> {
    
    /**
     * Save a saga state.
     * 
     * @param state the saga state to save
     * @return a Mono that completes when the state is saved
     */
    Mono<Void> saveState(SagaState<C> state);
    
    /**
     * Get a saga state by ID.
     * 
     * @param sagaId the saga ID
     * @return a Mono emitting the saga state if found
     */
    Mono<SagaState<C>> getState(String sagaId);
    
    /**
     * Update a saga state.
     * 
     * @param state the saga state to update
     * @return a Mono that completes when the state is updated
     */
    Mono<Void> updateState(SagaState<C> state);
    
    /**
     * Delete a saga state.
     * 
     * @param sagaId the saga ID
     * @return a Mono that completes when the state is deleted
     */
    Mono<Void> deleteState(String sagaId);
}
