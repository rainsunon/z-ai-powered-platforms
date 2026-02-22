package com.xrs.gateway.config;

import java.util.List;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Upload policy/constraints configuration.
 */
@Data
@ConfigurationProperties(prefix = "app.uploads")
public class UploadPolicyProperties {

  /** Maximum allowed file size in bytes. */
  private Long maxFileSizeBytes = 3L * 1024 * 1024 * 1024;

  /** Allowed content types list. Supports wildcards like "video/*". */
  private List<String> allowedContentTypes = List.of("video/*", "application/octet-stream");

  /** Abort INITIATED uploads older than this. */
  private Long staleAbortAfterMinutes = 1440L;

  /** Enable background cleanup job. */
  private boolean cleanupEnabled = true;
}
