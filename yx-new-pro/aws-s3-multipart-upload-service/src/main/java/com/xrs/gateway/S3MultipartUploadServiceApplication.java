package com.xrs.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Application entry point for the S3 multipart upload service.
 *
 * <p>This microservice authorizes users via OAuth2 (JWT resource server),
 * issues pre-signed S3 multipart upload URLs, and persists upload session
 * metadata in PostgreSQL.</p>
 */
@SpringBootApplication
@EnableScheduling
public class S3MultipartUploadServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(S3MultipartUploadServiceApplication.class, args);
  }
}
