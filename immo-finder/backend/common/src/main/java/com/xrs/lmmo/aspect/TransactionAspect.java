package com.xrs.asset.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;

/**
 * Transaction Aspect - Provides enhanced transaction management and logging
 * This aspect works alongside Spring's @Transactional to provide better visibility
 */
@Aspect
@Component
public class TransactionAspect {

    private static final Logger logger = LoggerFactory.getLogger(TransactionAspect.class);

    @PostConstruct
    public void init() {
        logger.warn("[ASPECT] ========================================");
        logger.warn("[ASPECT] TransactionAspect LOADED AND ACTIVE");
        logger.warn("[ASPECT] Ready to monitor transactions");
        logger.warn("[ASPECT] ========================================");
    }

    /**
     * Intercepts methods annotated with @Transactional
     * Provides logging for transaction start, commit, and rollback
     */
    @Around("@annotation(transactional)")
    public Object logTransactionalMethods(ProceedingJoinPoint joinPoint, Transactional transactional) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        
        logger.debug("[ASPECT] TRANSACTION START | Class: {} | Method: {} | ReadOnly: {} | Timeout: {}s | Propagation: {} | RollbackFor: {}", 
                    className, methodName, transactional.readOnly(), transactional.timeout(), 
                    transactional.propagation(),
                    transactional.rollbackFor().length > 0 ? 
                    java.util.Arrays.toString(transactional.rollbackFor()) : "default");

        long startTime = System.currentTimeMillis();
        
        try {
            // Execute the method within transaction
            Object result = joinPoint.proceed();
            
            long executionTime = System.currentTimeMillis() - startTime;
            String performanceIndicator = getPerformanceIndicator(executionTime);
            
            logger.debug("[ASPECT] TRANSACTION COMMITTED | Class: {} | Method: {} | Duration: {}ms {}", 
                        className, methodName, executionTime, performanceIndicator);
            
            // Warn about long transactions
            if (executionTime > 5000) {
                logger.warn("[ASPECT] *** LONG TRANSACTION WARNING | Method: {} | Duration: {}ms | Suggestion: Consider optimizing", 
                          methodName, executionTime);
            }
            
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            
            logger.error("[ASPECT] *** TRANSACTION ROLLED BACK | Class: {} | Method: {} | Duration: {}ms | Exception: {} | Reason: {}", 
                        className, methodName, executionTime, e.getClass().getSimpleName(), e.getMessage());
            
            if (logger.isDebugEnabled()) {
                logger.error("[ASPECT] Rollback details:", e);
            }
            
            throw e;
        }
    }

    /**
     * Monitors all methods in service implementations that might use transactions
     */
    @Around("execution(* com.xrs.assetmanagementsystem..service..*ServiceImpl.*(..)) && " +
            "@within(org.springframework.transaction.annotation.Transactional)")
    public Object monitorClassLevelTransactions(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        
        logger.debug("[ASPECT] Executing transactional method (class-level) | Class: {} | Method: {}", className, methodName);
        
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            logger.debug("[ASPECT] Transactional method completed | Method: {} | Time: {}ms", methodName, executionTime);
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            logger.warn("[ASPECT] Transactional method failed, will rollback | Method: {} | Time: {}ms", 
                       methodName, executionTime);
            throw e;
        }
    }

    /**
     * Logs database operations that modify data
     */
    @Around("execution(* com.xrs.assetmanagementsystem..repository.*Repository.save*(..)) || " +
            "execution(* com.xrs.assetmanagementsystem..repository.*Repository.delete*(..)) || " +
            "execution(* com.xrs.assetmanagementsystem..repository.*Repository.update*(..))")
    public Object logDataModifications(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String operationType = extractOperationType(methodName);
        
        logger.debug("[ASPECT] DATABASE {} OPERATION | Repository: {} | Method: {}()", operationType, className, methodName);
        
        if (logger.isTraceEnabled() && joinPoint.getArgs().length > 0) {
            logger.trace("[ASPECT] Parameters: {}", java.util.Arrays.toString(joinPoint.getArgs()));
        }
        
        long startTime = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            logger.debug("[ASPECT] Database {} successful | Method: {} | Time: {}ms", operationType, methodName, executionTime);
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            logger.error("[ASPECT] Database {} failed | Method: {} | Time: {}ms | Error: {}", 
                        operationType, methodName, executionTime, e.getMessage());
            throw e;
        }
    }

    /**
     * Extracts operation type from method name
     */
    private String extractOperationType(String methodName) {
        if (methodName.toLowerCase().contains("save")) {
            return "WRITE";
        } else if (methodName.toLowerCase().contains("delete")) {
            return "DELETE";
        } else if (methodName.toLowerCase().contains("update")) {
            return "UPDATE";
        }
        return "MODIFICATION";
    }

    /**
     * Gets performance indicator text based on execution time
     */
    private String getPerformanceIndicator(long executionTime) {
        if (executionTime < 100) {
            return "[EXCELLENT]";
        } else if (executionTime < 500) {
            return "[GOOD]";
        } else if (executionTime < 1000) {
            return "[MODERATE]";
        } else if (executionTime < 5000) {
            return "[SLOW]";
        } else {
            return "[VERY_SLOW]";
        }
    }
}
