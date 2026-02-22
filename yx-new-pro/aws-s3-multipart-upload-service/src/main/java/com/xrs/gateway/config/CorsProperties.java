package com.xrs.gateway.config;

import java.util.List;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * CORS settings for the HTTP API (SPA access).
 */
@Data
@ConfigurationProperties(prefix = "app.cors")
public class CorsProperties {
  /** Allowed origins for browsers (e.g. http://localhost:5173). */
  private List<String> allowedOrigins = List.of("http://localhost:5173");
}
