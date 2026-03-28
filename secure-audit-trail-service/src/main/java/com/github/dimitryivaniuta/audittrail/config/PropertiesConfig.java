package com.github.dimitryivaniuta.audittrail.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Enables application configuration properties bindings.
 */
@Configuration
@EnableConfigurationProperties({
        AuditHmacProperties.class
})
public class PropertiesConfig {
}
