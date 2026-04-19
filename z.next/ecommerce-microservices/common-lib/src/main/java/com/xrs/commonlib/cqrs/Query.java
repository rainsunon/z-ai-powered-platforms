package com.xrs.commonlib.cqrs;

import java.util.UUID;

/**
 * Marker interface for all Queries in the CQRS pattern.
 * Queries represent requests to read data from the system.
 * Queries should not modify system state.
 */
public interface Query {
    
    /**
     * Unique identifier for this query instance.
     * Used for caching, logging, and tracing.
     * 
     * @return the query ID
     */
    default String getQueryId() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Type of the query for routing and logging.
     * 
     * @return the query type name
     */
    default String getQueryType() {
        return this.getClass().getSimpleName();
    }
    
    /**
     * Validate the query before execution.
     * 
     * @throws IllegalArgumentException if the query is invalid
     */
    default void validate() {
        // Default implementation - override in specific queries
    }
}
