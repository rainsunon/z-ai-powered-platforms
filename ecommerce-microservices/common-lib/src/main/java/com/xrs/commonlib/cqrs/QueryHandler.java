package com.xrs.commonlib.cqrs;

import reactor.core.publisher.Mono;

/**
 * Generic interface for handling Queries in the CQRS pattern.
 * Query handlers are responsible for executing queries and returning results.
 * Query handlers should not modify system state.
 * 
 * @param <Q> the type of query this handler processes
 * @param <R> the type of result returned by this handler
 */
@FunctionalInterface
public interface QueryHandler<Q extends Query, R> {
    
    /**
     * Handle the query and return the result.
     * This method should be pure and side-effect free.
     * 
     * @param query the query to handle
     * @return a Mono emitting the result of handling the query
     */
    Mono<R> handle(Q query);
    
    /**
     * Get the type of query this handler processes.
     * Used for routing queries to appropriate handlers.
     * 
     * @return the query class
     */
    default Class<Q> getQueryType() {
        throw new UnsupportedOperationException("Query type must be specified by implementation");
    }
}
