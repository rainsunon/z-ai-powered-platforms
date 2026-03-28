package com.xrs.asset.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Monitoring Aspect - Tracks method execution time and operation counts with enhanced logging
 * This aspect provides performance monitoring across all services with beautiful metrics display
 */
@Aspect
@Component
public class MonitoringAspect {

    private static final Logger logger = LoggerFactory.getLogger(MonitoringAspect.class);

    @PostConstruct
    public void init() {
        logger.warn("[ASPECT] ========================================");
        logger.warn("[ASPECT] MonitoringAspect LOADED AND ACTIVE");
        logger.warn("[ASPECT] Ready to track performance metrics");
        logger.warn("[ASPECT] ========================================");
    }

    // Thread-safe maps to store metrics
    private final ConcurrentHashMap<String, AtomicLong> successCounters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> failureCounters = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> totalExecutionTime = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> executionCount = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> maxExecutionTime = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> minExecutionTime = new ConcurrentHashMap<>();

    /**
     * Monitors all service method executions
     * Tracks execution time, success/failure counts
     */
    @Around("execution(* com.xrs.assetmanagementsystem..service..*ServiceImpl.*(..))")
    public Object monitorServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = getMethodIdentifier(joinPoint);
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        long startTime = System.currentTimeMillis();

        try {
            // Execute the method
            Object result = joinPoint.proceed();
            
            // Record successful execution
            long executionTime = System.currentTimeMillis() - startTime;
            recordSuccess(methodName, executionTime);
            
            // Log slow operations
            if (executionTime > 1000) {
                logger.warn("[ASPECT] *** SLOW OPERATION DETECTED | Class: {} | Method: {} | Time: {}ms [SLOW] | Suggestion: Consider optimizing", 
                           className, methodName, executionTime);
            } else if (executionTime > 500) {
                logger.warn("[ASPECT] Moderate execution time: {} | Time: {}ms", methodName, executionTime);
            }
            
            return result;
            
        } catch (Throwable throwable) {
            // Record failed execution
            long executionTime = System.currentTimeMillis() - startTime;
            recordFailure(methodName, executionTime);
            
            logger.error("[ASPECT] *** OPERATION FAILED | Method: {} | Time: {}ms | Exception: {} | Message: {}", 
                        methodName, executionTime, throwable.getClass().getSimpleName(), throwable.getMessage());
            
            throw throwable;
        }
    }

    /**
     * Monitors all controller method executions
     */
    @Around("execution(* com.xrs.assetmanagementsystem..*Controller.*(..))")
    public Object monitorControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = getMethodIdentifier(joinPoint);
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;
            
            // Log API performance
            String performanceIndicator = getPerformanceIndicator(executionTime);
            logger.warn("[ASPECT] API Request completed | Controller: {} | Method: {}() | Time: {}ms {}", 
                      className, methodName, executionTime, performanceIndicator);
            
            // Warn about slow API calls
            if (executionTime > 2000) {
                logger.warn("[ASPECT] *** Slow API call detected | Controller: {} | Method: {}() | Time: {}ms", 
                          className, methodName, executionTime);
            }
            
            return result;
            
        } catch (Throwable throwable) {
            long executionTime = System.currentTimeMillis() - startTime;
            logger.error("[ASPECT] API Request failed | Controller: {} | Method: {}() | Time: {}ms | Error: {}", 
                       className, methodName, executionTime, throwable.getMessage());
            throw throwable;
        }
    }

    /**
     * Records a successful method execution
     */
    private void recordSuccess(String methodName, long executionTime) {
        successCounters.computeIfAbsent(methodName, k -> new AtomicLong(0)).incrementAndGet();
        totalExecutionTime.computeIfAbsent(methodName, k -> new AtomicLong(0)).addAndGet(executionTime);
        executionCount.computeIfAbsent(methodName, k -> new AtomicLong(0)).incrementAndGet();
        
        // Update max execution time
        maxExecutionTime.compute(methodName, (k, v) -> {
            if (v == null || executionTime > v.get()) {
                return new AtomicLong(executionTime);
            }
            return v;
        });
        
        // Update min execution time
        minExecutionTime.compute(methodName, (k, v) -> {
            if (v == null || executionTime < v.get()) {
                return new AtomicLong(executionTime);
            }
            return v;
        });
        
        logMetrics(methodName);
    }

    /**
     * Records a failed method execution
     */
    private void recordFailure(String methodName, long executionTime) {
        failureCounters.computeIfAbsent(methodName, k -> new AtomicLong(0)).incrementAndGet();
        totalExecutionTime.computeIfAbsent(methodName, k -> new AtomicLong(0)).addAndGet(executionTime);
        executionCount.computeIfAbsent(methodName, k -> new AtomicLong(0)).incrementAndGet();
        
        logMetrics(methodName);
    }

    /**
     * Logs metrics periodically (every 50 executions) with beautiful formatting
     */
    private void logMetrics(String methodName) {
        long execCount = executionCount.getOrDefault(methodName, new AtomicLong(0)).get();
        
        // Log metrics every 50 executions
        if (execCount > 0 && execCount % 50 == 0) {
            long successCount = successCounters.getOrDefault(methodName, new AtomicLong(0)).get();
            long failureCount = failureCounters.getOrDefault(methodName, new AtomicLong(0)).get();
            long totalTime = totalExecutionTime.getOrDefault(methodName, new AtomicLong(0)).get();
            long avgTime = execCount > 0 ? totalTime / execCount : 0;
            long maxTime = maxExecutionTime.getOrDefault(methodName, new AtomicLong(0)).get();
            long minTime = minExecutionTime.getOrDefault(methodName, new AtomicLong(Long.MAX_VALUE)).get();
            double successRate = execCount > 0 ? (successCount * 100.0 / execCount) : 0;
            
            logger.warn("[ASPECT] *** PERFORMANCE METRICS | Method: {} | Executions: {} | Success: {} ({:.2f}%) | Failures: {} ({:.2f}%) | Avg: {}ms | Min: {}ms | Max: {}ms", 
                       methodName, execCount, successCount, successRate, failureCount, 100 - successRate, avgTime, 
                       minTime == Long.MAX_VALUE ? 0 : minTime, maxTime);
        }
    }

    /**
     * Gets metrics for a specific method (can be used for monitoring endpoints)
     */
    public String getMetrics(String methodName) {
        long successCount = successCounters.getOrDefault(methodName, new AtomicLong(0)).get();
        long failureCount = failureCounters.getOrDefault(methodName, new AtomicLong(0)).get();
        long execCount = executionCount.getOrDefault(methodName, new AtomicLong(0)).get();
        long totalTime = totalExecutionTime.getOrDefault(methodName, new AtomicLong(0)).get();
        long avgTime = execCount > 0 ? totalTime / execCount : 0;
        long maxTime = maxExecutionTime.getOrDefault(methodName, new AtomicLong(0)).get();
        long minTime = minExecutionTime.getOrDefault(methodName, new AtomicLong(Long.MAX_VALUE)).get();
        double successRate = execCount > 0 ? (successCount * 100.0 / execCount) : 0;
        
        return String.format(
            "Method: %s | Executions: %d | Success: %d (%.2f%%) | Failures: %d | Avg: %dms | Min: %dms | Max: %dms",
            methodName, execCount, successCount, successRate, failureCount, avgTime, 
            minTime == Long.MAX_VALUE ? 0 : minTime, maxTime
        );
    }

    /**
     * Gets a clean method identifier
     */
    private String getMethodIdentifier(ProceedingJoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        return className + "." + methodName + "()";
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
        } else if (executionTime < 3000) {
            return "[SLOW]";
        } else {
            return "[VERY_SLOW]";
        }
    }
}
