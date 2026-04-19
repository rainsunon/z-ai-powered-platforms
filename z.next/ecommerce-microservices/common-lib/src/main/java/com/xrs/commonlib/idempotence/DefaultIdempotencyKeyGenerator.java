package com.xrs.commonlib.idempotence;

import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Objects;

/**
 * Default implementation of IdempotencyKeyGenerator.
 * Generates keys by hashing the method name and parameters.
 */
@Component
public class DefaultIdempotencyKeyGenerator implements IdempotencyKeyGenerator {
    
    @Override
    public String generateKey(Method method, Object[] args, Object target) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            
            // Include method name in the key
            String methodSignature = method.getDeclaringClass().getName() + "." + method.getName();
            digest.update(methodSignature.getBytes(StandardCharsets.UTF_8));
            
            // Include parameters in the key
            if (args != null) {
                for (Object arg : args) {
                    if (arg != null) {
                        // Use toString() for simple objects, hash code for complex ones
                        String argValue = arg.toString();
                        digest.update(argValue.getBytes(StandardCharsets.UTF_8));
                    }
                }
            }
            
            byte[] hash = digest.digest();
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate idempotency key", e);
        }
    }
}
