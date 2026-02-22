package com.xrs.gateway.uploads.api.dto;

import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

/**
 * Upload session view.
 */
@Data
@Builder
public class UploadDto {
  private UUID id;
  private String objectKey;
  private String fileName;
  private String contentType;
  private long fileSize;
  private String status;
  private long partSize;
  private int partCount;
  private OffsetDateTime createdAt;
  private OffsetDateTime completedAt;
}
