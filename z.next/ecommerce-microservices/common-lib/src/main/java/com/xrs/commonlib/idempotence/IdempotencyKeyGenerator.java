package com.xrs.commonlib.idempotence;

import java.lang.reflect.Method;

/**
 * Interface for generating idempotency keys.
 * Implementations can customize how keys are generated based on method parameters,
 * request context, or other criteria.
 */
public interface IdempotencyKeyGenerator {
    
    /**
     * Generate an idempotency key for the given method invocation.
     * 
     * @param method the method being invoked
     * @param args the method arguments
     * @param target the target object (for instance methods)
     * @return the generated idempotency key
     */
    String generateKey(Method method, Object[] args, Object target);
}
