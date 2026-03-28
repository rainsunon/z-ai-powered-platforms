package com.xrs.asset.aspect;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import com.xrs.asset.errors.ApiReturnCode;
import com.xrs.asset.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Validation Aspect - Validates DTOs and request parameters before business logic execution
 * This aspect provides centralized validation across all services with enhanced logging
 */
@Aspect
@Component
public class ValidationAspect {

    private static final Logger logger = LoggerFactory.getLogger(ValidationAspect.class);

    @PostConstruct
    public void init() {
        logger.warn("[ASPECT] ========================================");
        logger.warn("[ASPECT] ValidationAspect LOADED AND ACTIVE");
        logger.warn("[ASPECT] Ready to validate parameters");
        logger.warn("[ASPECT] ========================================");
    }

    @Autowired(required = false)
    private Validator validator;

    /**
     * Intercepts service method calls and validates parameters
     * Validates any parameters that have validation annotations
     */
    @Before("execution(* com.xrs.assetmanagementsystem..service..*ServiceImpl.*(..))")
    public void validateMethodParameters(JoinPoint joinPoint) {
        if (validator == null) {
            return;
        }

        Object[] args = joinPoint.getArgs();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();

        logger.debug("[ASPECT] Validating parameters | Class: {} | Method: {}()", className, methodName);

        int validatedCount = 0;
        int violationCount = 0;

        for (Object arg : args) {
            if (arg != null && shouldValidate(arg)) {
                validatedCount++;
                Set<ConstraintViolation<Object>> violations = validator.validate(arg);
                
                if (!violations.isEmpty()) {
                    violationCount += violations.size();
                    logValidationFailure(className, methodName, arg, violations);
                } else {
                    logger.trace("[ASPECT] Parameter validated | Type: {} | Class: {} | Method: {}()", 
                               arg.getClass().getSimpleName(), className, methodName);
                }
            }
        }

        if (validatedCount > 0 && violationCount == 0) {
            logger.debug("[ASPECT] All {} parameter(s) validated successfully | Class: {} | Method: {}()", 
                        validatedCount, className, methodName);
        }
    }

    /**
     * Determines if an object should be validated
     */
    private boolean shouldValidate(Object obj) {
        // Validate DTOs and entities, skip primitives and common types
        String className = obj.getClass().getName();
        return className.contains("dto") || className.contains("entity") ||
               className.contains("assetmanagementsystem");
    }

    /**
     * Logs validation failure with beautiful formatting
     */
    private void logValidationFailure(String className, String methodName, Object obj, 
                                     Set<ConstraintViolation<Object>> violations) {
        String errorMessage = violations.stream()
                .map(violation -> {
                    String property = violation.getPropertyPath().toString();
                    String message = violation.getMessage();
                    Object invalidValue = violation.getInvalidValue();
                    return String.format("%s: %s (value: %s)", property, message, invalidValue);
                })
                .collect(Collectors.joining("\n   "));

        logger.warn("[ASPECT] *** VALIDATION FAILED | Class: {} | Method: {}() | Object Type: {} | Violations: {}", 
                   className, methodName, obj.getClass().getSimpleName(), violations.size());
        logger.warn("[ASPECT] Violation details: {}", errorMessage);

        throw new BusinessException(ApiReturnCode.BAD_REQUEST, 
                                   "Validation failed: " + violations.stream()
                                       .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                                       .collect(Collectors.joining(", ")));
    }

    /**
     * Validates collection parameters
     */
    private void validateCollection(Iterable<?> collection, String methodName) {
        int index = 0;
        for (Object item : collection) {
            if (item != null && shouldValidate(item)) {
                Set<ConstraintViolation<Object>> violations = validator.validate(item);
                if (!violations.isEmpty()) {
                    logger.warn("Validation failed for collection item at index {} in method {}", 
                              index, methodName);
                    String errorMessage = violations.stream()
                            .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                            .collect(Collectors.joining(", "));
                    throw new BusinessException(ApiReturnCode.BAD_REQUEST, 
                                               "Validation failed for collection item: " + errorMessage);
                }
            }
            index++;
        }
    }
}
