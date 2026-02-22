package com.xrs.aimlservice.config;

import com.xrs.commonlib.security.BaseSecurityConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

/**
 * Security configuration for AI/ML Service.
 * Extends BaseSecurityConfig from common-lib for consistent security across services.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends BaseSecurityConfig {

    // Additional security configurations specific to AI/ML service can be added here
    // For example, you can customize request matchers for AI/ML endpoints
}
