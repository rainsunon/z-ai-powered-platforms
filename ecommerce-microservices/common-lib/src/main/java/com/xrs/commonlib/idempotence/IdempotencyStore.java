package com.xrs.commonlib.idempotence;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Interface for storing and retrieving idempotency records.
 * Implementations can use in-memory storage, Redis, database, or other mechanisms.
 */
public interface IdempotencyStore {
    
    /**
     * Check if a request with the given key has been processed.
     * 
     * @param key the idempotency key
     * @return true if the request has been processed, false otherwise
     */
    boolean isProcessed(String key);
    
    /**
     * Get the result of a previously processed request.
     * 
     * @param key the idempotency key
     * @return optional containing the result if found
     */
    Optional<Object> getResult(String key);
    
    /**
     * Store a request as processed with its result.
     * 
     * @param key the idempotency key
     * @param result the result to cache
     * @param ttl time-to-live in seconds
     */
    void store(String key, Object result, long ttl);
    
    /**
     * Mark a request as processed without storing the result.
     * 
     * @param key the idempotency key
     * @param ttl time-to-live in seconds
     */
    void markProcessed(String key, long ttl);
    
    /**
     * Remove an idempotency record.
     * 
     * @param key the idempotency key
     */
    void remove(String key);
    
    /**
     * Clean up expired idempotency records.
     */
    void cleanup();
}
