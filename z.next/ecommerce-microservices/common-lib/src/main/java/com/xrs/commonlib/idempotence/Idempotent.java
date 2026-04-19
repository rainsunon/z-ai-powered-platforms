package com.xrs.commonlib.idempotence;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods as idempotent.
 * An idempotent operation can be applied multiple times without changing the result
 * beyond the initial application.
 * 
 * Use this annotation to indicate that a method should handle duplicate requests
 * gracefully and return the same result for the same input.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Idempotent {
    
    /**
     * The key generator to use for creating idempotency keys.
     * Default is to use the DefaultIdempotencyKeyGenerator.
     * 
     * @return the key generator class
     */
    Class<? extends IdempotencyKeyGenerator> keyGenerator() default DefaultIdempotencyKeyGenerator.class;
    
    /**
     * The time-to-live for idempotency records in seconds.
     * After this time, the same key can be processed again.
     * Default is 24 hours (86400 seconds).
     * 
     * @return TTL in seconds
     */
    long ttl() default 86400;
    
    /**
     * Whether to store the result for idempotent responses.
     * If true, the result of the first execution is cached and returned for duplicate requests.
     * If false, only the execution status is tracked.
     * 
     * @return true to cache results, false otherwise
     */
    boolean cacheResult() default true;
}
