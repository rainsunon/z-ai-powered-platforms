package com.xrs.commonlib.saga;

import reactor.core.publisher.Mono;

/**
 * Interface for listening to saga events.
 * Implementations can log events, update dashboards, or trigger notifications.
 * 
 * @param <C> the context type
 */
@FunctionalInterface
public interface SagaEventListener<C> {
    
    /**
     * Handle a saga event.
     * 
     * @param event the saga event
     * @return a Mono that completes when the event is handled
     */
    Mono<Void> onEvent(SagaEvent<C> event);
}
