package com.xrs.gateway.uploads.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.*;

/**
 * Upload session persisted in PostgreSQL.
 */
@Entity
@Table(name = "uploads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadEntity {

  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  @Column(name = "user_sub", nullable = false, length = 128)
  private String userSub;

  @Column(name = "username", length = 128)
  private String username;

  @Column(nullable = false, length = 128)
  private String bucket;

  @Column(name = "object_key", nullable = false, length = 1024)
  private String objectKey;

  @Column(name = "s3_upload_id", nullable = false, length = 256)
  private String s3UploadId;

  @Column(name = "file_name", nullable = false, length = 512)
  private String fileName;

  @Column(name = "content_type", nullable = false, length = 256)
  private String contentType;

  @Column(name = "file_size", nullable = false)
  private long fileSize;

  @Column(name = "part_size", nullable = false)
  private long partSize;

  @Column(name = "part_count", nullable = false)
  private int partCount;

  @Column(name = "idempotency_key", length = 128)
  private String idempotencyKey;

  /** INITIATED | COMPLETED | ABORTED | FAILED */
  @Column(nullable = false, length = 32)
  private String status;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;

  @Column(name = "completed_at")
  private OffsetDateTime completedAt;

  @Version
  @Column(nullable = false)
  private long version;
}
