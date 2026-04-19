package com.xrs.aimlservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI configuration for AI/ML Service API documentation.
 */
@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name:AI-ML-SERVICE}")
    private String applicationName;

    @Value("${server.port:8094}")
    private String serverPort;

    @Bean
    public OpenAPI aiMlServiceOpenAPI() {
        Server server = new Server();
        server.setUrl("http://localhost:" + serverPort);
        server.setDescription("Development Server");

        Contact contact = new Contact();
        contact.setName("XRS Platform Team");
        contact.setEmail("support@xrs-platform.com");

        License license = new License()
                .name("Apache 2.0")
                .url("https://www.apache.org/licenses/LICENSE-2.0.html");

        Info info = new Info()
                .title(applicationName + " API")
                .version("1.0.0")
                .contact(contact)
                .description("AI/ML Service provides inference, chatbot, RAG, personalization, and predictive analytics capabilities for the e-commerce platform.")
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(server));
    }
}
