package com.xrs.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * AWS S3 related configuration.
 */
@Data
@ConfigurationProperties(prefix = "app.s3")
public class S3Properties {

  /** AWS region, e.g. eu-central-1. */
  private String region;

  /** Target bucket name. */
  private String bucket;

  /** Optional endpoint override (e.g. LocalStack http://localhost:4566). */
  private String endpoint;

  /** Pre-signed URL expiry (minutes). */
  private Integer presignExpirationMinutes = 20;

  /** Multipart part size in bytes. Must be >= 5 MiB (except last part). */
  private Long partSizeBytes = 16L * 1024 * 1024;

  /** Maximum number of parts (S3 hard limit is 10,000). */
  private Integer maxPartCount = 10_000;

  /** Server-side encryption mode. */
  private SseMode sse = SseMode.NONE;

  /** KMS key id (required for AWS_KMS). */
  private String kmsKeyId;

  public enum SseMode {
    NONE,
    AES256,
    AWS_KMS
  }
}
