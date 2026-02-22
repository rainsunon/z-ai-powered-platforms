package com.xrs.multitenant.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) configuration for Secure Multi-Tenant API Platform.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
            .info(new Info()
                .title("Secure Multi-Tenant API Platform")
                .version("1.0.0")
                .description("Multi-tenant SaaS platform with PostgreSQL Row-Level Security (RLS), JWT authentication with JWKS, " +
                    "Redis caching, Kafka event streaming, and tenant isolation. Supports per-tenant data segregation.")
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
                .description("JWT authentication with tenant claim for multi-tenant access control"));
    }
}
