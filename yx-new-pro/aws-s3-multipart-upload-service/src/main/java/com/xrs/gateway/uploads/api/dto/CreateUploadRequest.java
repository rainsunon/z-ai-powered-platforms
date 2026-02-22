package com.xrs.gateway.uploads.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Create multipart upload session request.
 */
@Data
public class CreateUploadRequest {

  @NotBlank
  private String fileName;

  @NotBlank
  private String contentType;

  @Min(1)
  private long fileSize;

  /**
   * Optional idempotency key. If the same user repeats the request with the same key,
   * the service may return the existing INITIATED upload.
   */
  @Size(max = 128)
  private String idempotencyKey;
}
