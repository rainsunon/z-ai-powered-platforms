package com.xrs.gateway.uploads.api.dto;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

/**
 * Response returned after creating a multipart upload session.
 *
 * <p>Part upload URLs are generated on-demand using {@code partUrlEndpoint}.</p>
 */
@Data
@Builder
public class CreateUploadResponse {
  private UUID uploadId;
  private String objectKey;
  private long partSize;
  private int partCount;
  private OffsetDateTime expiresAt;
  private String partUrlEndpoint;
}
