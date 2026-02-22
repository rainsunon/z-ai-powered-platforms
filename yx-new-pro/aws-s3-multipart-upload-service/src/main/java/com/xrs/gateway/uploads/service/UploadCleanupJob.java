package com.xrs.gateway.uploads.service;

import com.xrs.gateway.config.UploadPolicyProperties;
import com.xrs.gateway.uploads.repo.UploadRepository;
import java.time.OffsetDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Background cleanup job aborting stale INITIATED uploads.
 *
 * <p>Rationale: multipart uploads consume S3 storage for parts until completed/aborted.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class UploadCleanupJob {

  private final UploadPolicyProperties policy;
  private final UploadRepository repo;
  private final S3MultipartOperations s3;

  @Scheduled(fixedDelayString = "${UPLOAD_CLEANUP_DELAY_MS:600000}")
  @Transactional
  public void abortStaleUploads() {
    if (!policy.isCleanupEnabled()) {
      return;
    }

    OffsetDateTime cutoff = OffsetDateTime.now().minusMinutes(policy.getStaleAbortAfterMinutes());
    var stale = repo.findTop200ByStatusAndCreatedAtBeforeOrderByCreatedAtAsc("INITIATED", cutoff);
    if (stale.isEmpty()) {
      return;
    }

    log.info("Found {} stale uploads to abort (cutoff={})", stale.size(), cutoff);

    for (var u : stale) {
      try {
        s3.abortMultipartUpload(u.getBucket(), u.getObjectKey(), u.getS3UploadId());
        u.setStatus("ABORTED");
        u.setUpdatedAt(OffsetDateTime.now());
      } catch (Exception ex) {
        // best-effort; keep record for inspection
        log.warn("Failed to abort stale upload {} in S3: {}", u.getId(), ex.toString());
        u.setStatus("FAILED");
        u.setUpdatedAt(OffsetDateTime.now());
      }
      repo.save(u);
    }
  }
}
