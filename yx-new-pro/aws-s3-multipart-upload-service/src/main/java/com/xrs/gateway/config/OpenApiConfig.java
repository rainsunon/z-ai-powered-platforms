package com.xrs.gateway.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) configuration.
 */
@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI openAPI() {
    final String schemeName = "bearerAuth";
    return new OpenAPI()
      .info(new Info()
        .title("AWS S3 Multipart Upload Service")
        .version("1.1.0")
        .description("Authorize users and orchestrate S3 multipart uploads with pre-signed URLs."))
      .addSecurityItem(new SecurityRequirement().addList(schemeName))
      .schemaRequirement(schemeName, new SecurityScheme()
        .name(schemeName)
        .type(SecurityScheme.Type.HTTP)
        .scheme("bearer")
        .bearerFormat("JWT"));
  }
}
