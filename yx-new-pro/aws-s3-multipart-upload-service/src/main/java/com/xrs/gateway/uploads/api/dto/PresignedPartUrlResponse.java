package com.xrs.gateway.uploads.api.dto;

import java.time.OffsetDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Pre-signed URL for uploading a specific part.
 */
@Data
@AllArgsConstructor
public class PresignedPartUrlResponse {
  private int partNumber;
  private String url;
  private OffsetDateTime expiresAt;
}
