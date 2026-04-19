package com.xrs.commonlib.cqrs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * QueryBus routes queries to their appropriate handlers.
 * Implements the mediator pattern for query handling.
 */
@Component
@Slf4j
public class QueryBus {
    
    private final Map<Class<? extends Query>, QueryHandler<?, ?>> handlers = new ConcurrentHashMap<>();
    
    /**
     * Register a query handler for a specific query type.
     * 
     * @param queryType the query class
     * @param handler the handler instance
     * @param <Q> the query type
     * @param <R> the result type
     */
    public <Q extends Query, R> void registerHandler(Class<Q> queryType, QueryHandler<Q, R> handler) {
        handlers.put(queryType, handler);
        log.debug("Registered handler for query type: {}", queryType.getSimpleName());
    }
    
    /**
     * Dispatch a query to its registered handler.
     * 
     * @param query the query to dispatch
     * @param <Q> the query type
     * @param <R> the result type
     * @return a Mono emitting the result
     */
    @SuppressWarnings("unchecked")
    public <Q extends Query, R> Mono<R> dispatch(Q query) {
        query.validate();
        
        QueryHandler<Q, R> handler = (QueryHandler<Q, R>) handlers.get(query.getClass());
        
        if (handler == null) {
            log.error("No handler registered for query type: {}", query.getClass().getSimpleName());
            return Mono.error(new IllegalStateException(
                "No handler registered for query type: " + query.getClass().getSimpleName()
            ));
        }
        
        log.debug("Dispatching query: {} with ID: {}", query.getQueryType(), query.getQueryId());
        
        return Mono.defer(() -> handler.handle(query))
                .doOnSuccess(result -> log.debug("Query {} completed successfully", query.getQueryType()))
                .doOnError(error -> log.error("Query {} failed: {}", query.getQueryType(), error.getMessage()));
    }
    
    /**
     * Check if a handler is registered for the given query type.
     * 
     * @param queryType the query class
     * @return true if a handler is registered, false otherwise
     */
    public boolean hasHandler(Class<? extends Query> queryType) {
        return handlers.containsKey(queryType);
    }
}
