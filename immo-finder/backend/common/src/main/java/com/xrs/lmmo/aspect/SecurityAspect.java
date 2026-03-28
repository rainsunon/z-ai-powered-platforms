package com.xrs.asset.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import com.xrs.asset.entity.User;
import com.xrs.asset.util.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

/**
 * Security Aspect - Intercepts methods to validate authentication and authorization
 * This aspect provides centralized security enforcement with enhanced logging
 */
@Aspect
@Component
public class SecurityAspect {

    private static final Logger logger = LoggerFactory.getLogger(SecurityAspect.class);

    @PostConstruct
    public void init() {
        logger.warn("[ASPECT] ========================================");
        logger.warn("[ASPECT] SecurityAspect LOADED AND ACTIVE");
        logger.warn("[ASPECT] Ready to enforce security checks");
        logger.warn("[ASPECT] ========================================");
    }

    /**
     * Intercepts all controller methods with @PreAuthorize annotation
     * Validates that user has proper authentication and authorization
     */
    @Before("@annotation(org.springframework.security.access.prepost.PreAuthorize)")
    public void checkSecurity(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        PreAuthorize preAuthorize = signature.getMethod().getAnnotation(PreAuthorize.class);
        
        if (preAuthorize != null) {
            String methodName = signature.getName();
            String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
            String expression = preAuthorize.value();
            
            logger.debug("[ASPECT] SECURITY CHECK | Class: {} | Method: {}() | Expression: {}", 
                        className, methodName, expression);
            
            try {
                // Get current authenticated user
                User currentUser = SecurityUtils.getCurrentUser();
                
                if (currentUser == null) {
                    logger.warn("[ASPECT] *** UNAUTHORIZED ACCESS ATTEMPT | Class: {} | Method: {}() | Expression: {} | User: <not authenticated> | Reason: User is not authenticated", 
                               className, methodName, expression);
                    
                    throw new AccessDeniedException("User is not authenticated");
                }
                
                logger.debug("[ASPECT] User authorized | User: {} | Role: {} | Method: {}", 
                           currentUser.getUsername(), 
                           currentUser.getRole() != null ? currentUser.getRole().getName() : "N/A",
                           methodName);
                           
            } catch (AccessDeniedException e) {
                throw e;
            } catch (Exception e) {
                logger.error("[ASPECT] *** SECURITY VALIDATION FAILED | Class: {} | Method: {}() | Exception: {} | Message: {}", 
                            className, methodName, e.getClass().getSimpleName(), e.getMessage());
                
                if (logger.isDebugEnabled()) {
                    logger.error("[ASPECT] Stack trace:", e);
                }
                
                throw e;
            }
        }
    }

    /**
     * Logs all controller access attempts with user information
     */
    @Before("execution(* com.xrs.assetmanagementsystem..*Controller.*(..))")
    public void logControllerAccess(JoinPoint joinPoint) {
        try {
            User currentUser = SecurityUtils.getCurrentUser();
            String methodName = joinPoint.getSignature().getName();
            String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
            
            if (currentUser != null) {
                logger.debug("[ASPECT] Controller access | User: {} | Role: {} | Controller: {} | Method: {}()", 
                           currentUser.getUsername(),
                           currentUser.getRole() != null ? currentUser.getRole().getName() : "N/A",
                           className,
                           methodName);
            } else {
                logger.debug("[ASPECT] Controller access | User: <anonymous> | Controller: {} | Method: {}()", 
                           className, methodName);
            }
        } catch (Exception e) {
            // Silently handle - user might not be authenticated yet
            logger.trace("Unable to retrieve current user for logging: {}", e.getMessage());
        }
    }

    /**
     * Logs unauthorized access attempts
     */
    @Before("execution(* com.xrs.assetmanagementsystem..*Controller.*(..)) && " +
            "!execution(* com.xrs.assetmanagementsystem..*Controller.*(..))")
    public void logUnauthorizedAttempts(JoinPoint joinPoint) {
        // This is handled by checkSecurity method above
        // Keeping this for potential future use
    }
}
