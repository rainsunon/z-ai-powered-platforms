package com.xrs.asset.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Logging Aspect - Provides centralized, beautifully formatted logging for method entry, exit, and exceptions
 * This aspect logs important operations across all services with enhanced visibility
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger aspectLogger = LoggerFactory.getLogger(LoggingAspect.class);

    @PostConstruct
    public void init() {
        aspectLogger.warn("[ASPECT] ========================================");
        aspectLogger.warn("[ASPECT] LoggingAspect LOADED AND ACTIVE");
        aspectLogger.warn("[ASPECT] Ready to intercept service methods");
        aspectLogger.warn("[ASPECT] ========================================");
    }

    /**
     * Logs entry and exit of all service methods with detailed information
     */
    @Around("execution(* com.xrs.assetmanagementsystem..service..*ServiceImpl.*(..))")
    public Object logServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String fullClassName = joinPoint.getSignature().getDeclaringTypeName();
        
        // Format arguments for logging
        String argsString = formatArguments(joinPoint.getArgs());

        // Log method entry - Use WARN for visibility, single line format
        logger.warn("[ASPECT] >>> SERVICE METHOD ENTRY | Class: {} | Method: {}() | Args: {} | Path: {}.{}", 
                   className, methodName, joinPoint.getArgs().length, fullClassName, methodName);
        
        if (logger.isDebugEnabled() && joinPoint.getArgs().length > 0) {
            logger.debug("[ASPECT] Arguments details: {}", argsString);
        }

        long startTime = System.currentTimeMillis();
        Object result = null;

        try {
            // Proceed with method execution
            result = joinPoint.proceed();
            
            long executionTime = System.currentTimeMillis() - startTime;
            String performanceIndicator = getPerformanceIndicator(executionTime);
            
            // Log method exit - single line format
            String returnInfo = result != null ? " | Return: " + result.getClass().getSimpleName() : "";
            logger.warn("[ASPECT] <<< SERVICE METHOD EXIT - SUCCESS | Class: {} | Method: {}() | Time: {}ms {} {}", 
                       className, methodName, executionTime, performanceIndicator, returnInfo);
            
            if (logger.isDebugEnabled() && result != null) {
                String resultString = formatResult(result);
                logger.debug("[ASPECT] Return value: {}", resultString);
            }
            
            return result;
            
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            
            // Log exception - single line format
            logger.error("[ASPECT] <<< SERVICE METHOD EXIT - EXCEPTION | Class: {} | Method: {}() | Time: {}ms | Exception: {} | Message: {}", 
                        className, methodName, executionTime, e.getClass().getSimpleName(), e.getMessage());
            
            if (logger.isDebugEnabled()) {
                logger.error("[ASPECT] Stack trace:", e);
            }
            
            throw e;
        }
    }

    /**
     * Logs all controller method invocations with HTTP method and path
     */
    @Before("execution(* com.xrs.assetmanagementsystem..*Controller.*(..))")
    public void logControllerMethods(JoinPoint joinPoint) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        
        // Try to extract HTTP method and path from annotations
        String httpMethod = extractHttpMethod(joinPoint);
        String path = extractPath(joinPoint);
        
        String endpointInfo = (httpMethod != null && path != null) ? " | Endpoint: " + httpMethod + " " + path : "";
        logger.warn("[ASPECT] >>> API REQUEST RECEIVED | Controller: {} | Method: {}() | Params: {}{}", 
                   className, methodName, joinPoint.getArgs().length, endpointInfo);
        
        if (logger.isDebugEnabled() && joinPoint.getArgs().length > 0) {
            logger.debug("[ASPECT] Request parameters: {}", formatArguments(joinPoint.getArgs()));
        }
    }

    /**
     * Logs all repository operations
     */
    @Before("execution(* com.xrs.assetmanagementsystem..repository.*Repository.*(..))")
    public void logRepositoryMethods(JoinPoint joinPoint) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        
        if (logger.isDebugEnabled()) {
            String methodName = joinPoint.getSignature().getName();
            String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
            
            logger.debug("🗄️  Repository Operation: {}.{}()", className, methodName);
            
            if (joinPoint.getArgs().length > 0) {
                logger.debug("   Parameters: {}", formatArguments(joinPoint.getArgs()));
            }
        }
    }

    /**
     * Logs all exceptions thrown from service layer
     */
    @AfterThrowing(pointcut = "execution(* com.xrs.assetmanagementsystem..service..*(..))",
                   throwing = "exception")
    public void logServiceExceptions(JoinPoint joinPoint, Throwable exception) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        
        logger.error("[ASPECT] *** SERVICE EXCEPTION DETECTED | Class: {} | Method: {}() | Exception: {} | Message: {}", 
                    className, methodName, exception.getClass().getSimpleName(), exception.getMessage());
        
        if (logger.isDebugEnabled()) {
            logger.error("[ASPECT] Full stack trace:", exception);
        }
    }

    /**
     * Formats method arguments for logging
     */
    private String formatArguments(Object[] args) {
        if (args == null || args.length == 0) {
            return "none";
        }
        
        return Arrays.stream(args)
                .map(arg -> {
                    if (arg == null) {
                        return "null";
                    }
                    // Truncate long strings/objects
                    String str = arg.toString();
                    if (str.length() > 200) {
                        return str.substring(0, 200) + "... (truncated)";
                    }
                    return str;
                })
                .collect(Collectors.joining(", "));
    }

    /**
     * Formats result for logging
     */
    private String formatResult(Object result) {
        if (result == null) {
            return "null";
        }
        
        String str = result.toString();
        if (str.length() > 500) {
            return str.substring(0, 500) + "... (truncated)";
        }
        return str;
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

    /**
     * Extracts HTTP method from controller method annotations
     */
    private String extractHttpMethod(JoinPoint joinPoint) {
        try {
            var method = ((org.aspectj.lang.reflect.MethodSignature) joinPoint.getSignature()).getMethod();
            
            if (method.isAnnotationPresent(org.springframework.web.bind.annotation.GetMapping.class)) {
                return "GET";
            } else if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PostMapping.class)) {
                return "POST";
            } else if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PutMapping.class)) {
                return "PUT";
            } else if (method.isAnnotationPresent(org.springframework.web.bind.annotation.DeleteMapping.class)) {
                return "DELETE";
            } else if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PatchMapping.class)) {
                return "PATCH";
            }
        } catch (Exception e) {
            // Ignore
        }
        return null;
    }

    /**
     * Extracts path from controller method annotations
     */
    private String extractPath(JoinPoint joinPoint) {
        try {
            var method = ((org.aspectj.lang.reflect.MethodSignature) joinPoint.getSignature()).getMethod();
            var clazz = joinPoint.getTarget().getClass();
            
            // Get class-level path
            String classPath = "";
            if (clazz.isAnnotationPresent(RequestMapping.class)) {
                RequestMapping classMapping = clazz.getAnnotation(RequestMapping.class);
                if (classMapping.value().length > 0) {
                    classPath = classMapping.value()[0];
                }
            }
            
            // Get method-level path
            String methodPath = "";
            if (method.isAnnotationPresent(org.springframework.web.bind.annotation.GetMapping.class)) {
                org.springframework.web.bind.annotation.GetMapping mapping = 
                    method.getAnnotation(org.springframework.web.bind.annotation.GetMapping.class);
                if (mapping.value().length > 0) {
                    methodPath = mapping.value()[0];
                }
            } else if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PostMapping.class)) {
                org.springframework.web.bind.annotation.PostMapping mapping = 
                    method.getAnnotation(org.springframework.web.bind.annotation.PostMapping.class);
                if (mapping.value().length > 0) {
                    methodPath = mapping.value()[0];
                }
            } else if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PutMapping.class)) {
                org.springframework.web.bind.annotation.PutMapping mapping = 
                    method.getAnnotation(org.springframework.web.bind.annotation.PutMapping.class);
                if (mapping.value().length > 0) {
                    methodPath = mapping.value()[0];
                }
            } else if (method.isAnnotationPresent(org.springframework.web.bind.annotation.DeleteMapping.class)) {
                org.springframework.web.bind.annotation.DeleteMapping mapping = 
                    method.getAnnotation(org.springframework.web.bind.annotation.DeleteMapping.class);
                if (mapping.value().length > 0) {
                    methodPath = mapping.value()[0];
                }
            }
            
            return classPath + methodPath;
        } catch (Exception e) {
            // Ignore
        }
        return null;
    }
}
