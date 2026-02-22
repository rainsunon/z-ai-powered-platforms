package com.xrs.botdefense.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) configuration for Adaptive Rate Limiter Bot Defense API.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
            .info(new Info()
                .title("Adaptive Rate Limiter Bot Defense API")
                .version("1.0.0")
                .description("Adaptive rate limiting and bot defense service with multi-level token buckets (IP, User, Tenant), " +
                    "risk-based throttling, CAPTCHA step-up challenges, and anomaly detection. Integrates with Redis and Kafka.")
                .contact(new Contact()
                    .name("API Support")
                    .email("support@xrs.com"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .schemaRequirement(securitySchemeName, new SecurityScheme()
                .name(securitySchemeName)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("JWT authentication for protected endpoints"));
    }
}
