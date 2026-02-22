package com.xrs.gateway.uploads.service;

import com.xrs.gateway.config.S3Properties;
import com.xrs.gateway.config.UploadPolicyProperties;
import com.xrs.gateway.uploads.api.dto.*;
import com.xrs.gateway.uploads.domain.UploadEntity;
import com.xrs.gateway.uploads.repo.UploadRepository;
import com.xrs.gateway.web.errors.*;
import java.time.OffsetDateTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.services.s3.model.CompletedPart;

/**
 * Core upload lifecycle service.
 *
 * <p>Design goals:</p>
 * <ul>
 *   <li>Do not proxy gigabytes through the backend.</li>
 *   <li>Use S3 Multipart Upload + pre-signed UploadPart URLs.</li>
 *   <li>Persist server-side session metadata for auditing and idempotency.</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
public class UploadService {

  private static final long MIN_PART_SIZE_BYTES = 5L * 1024 * 1024;

  private final S3Properties s3Props;
  private final UploadPolicyProperties uploadPolicy;
  private final UploadRepository repo;
  private final S3MultipartOperations s3;
  private final KeyGenerator keyGenerator;
  private final ContentTypeAllowlist contentTypeAllowlist;

  @Transactional
  public CreateUploadResponse create(Jwt jwt, CreateUploadRequest req, String baseUrl) {
    validateCreate(req);

    String userSub = jwt.getSubject();
    String idem = normalizeIdempotencyKey(req.getIdempotencyKey());

    if (idem != null) {
      Optional<UploadEntity> existing = repo.findByUserSubAndIdempotencyKey(userSub, idem);
      if (existing.isPresent() && "INITIATED".equals(existing.get().getStatus())) {
        UploadEntity u = existing.get();
        return toCreateResponse(u, baseUrl);
      }
    }

    long partSize = Math.max(MIN_PART_SIZE_BYTES, s3Props.getPartSizeBytes() == null ? MIN_PART_SIZE_BYTES : s3Props.getPartSizeBytes());
    int partCount = calcPartCount(req.getFileSize(), partSize);

    if (partCount <= 0) {
      throw new BadRequestException("Invalid partCount computed");
    }
    if (partCount > s3Props.getMaxPartCount()) {
      throw new BadRequestException("Too many parts (" + partCount + "). Increase part size.");
    }

    String bucket = s3Props.getBucket();
    String key = keyGenerator.generate(userSub, req.getFileName());

    String uploadId;
    try {
      uploadId = s3.createMultipartUpload(bucket, key, req.getContentType());
    } catch (SdkException ex) {
      throw new UpstreamException("Failed to create multipart upload in S3", ex);
    }

    UUID id = UUID.randomUUID();
    OffsetDateTime now = OffsetDateTime.now();

    UploadEntity entity = UploadEntity.builder()
      .id(id)
      .userSub(userSub)
      .username(jwt.getClaimAsString("preferred_username"))
      .bucket(bucket)
      .objectKey(key)
      .s3UploadId(uploadId)
      .fileName(req.getFileName())
      .contentType(req.getContentType())
      .fileSize(req.getFileSize())
      .partSize(partSize)
      .partCount(partCount)
      .idempotencyKey(idem)
      .status("INITIATED")
      .createdAt(now)
      .updatedAt(now)
      .version(0)
      .build();

    repo.save(entity);
    return toCreateResponse(entity, baseUrl);
  }

  @Transactional(readOnly = true)
  public PresignedPartUrlResponse presignPartUrl(Jwt jwt, UUID uploadSessionId, int partNumber, String baseUrl) {
    UploadEntity u = repo.findById(uploadSessionId).orElseThrow(() -> new NotFoundException("Upload not found"));
    requireOwner(jwt, u);
    if (!"INITIATED".equals(u.getStatus())) {
      throw new ConflictException("Upload is not in INITIATED state");
    }
    if (partNumber < 1 || partNumber > u.getPartCount()) {
      throw new BadRequestException("partNumber must be between 1 and " + u.getPartCount());
    }

    String url;
    try {
      url = s3.presignUploadPartUrl(u.getBucket(), u.getObjectKey(), u.getS3UploadId(), partNumber);
    } catch (SdkException ex) {
      throw new UpstreamException("Failed to presign part url", ex);
    }

    return new PresignedPartUrlResponse(
      partNumber,
      url,
      OffsetDateTime.now().plusMinutes(s3Props.getPresignExpirationMinutes())
    );
  }

  @Transactional
  public void complete(Jwt jwt, UUID uploadSessionId, CompleteUploadRequest req) {
    UploadEntity u = repo.findById(uploadSessionId).orElseThrow(() -> new NotFoundException("Upload not found"));
    requireOwner(jwt, u);
    if (!"INITIATED".equals(u.getStatus())) {
      throw new ConflictException("Upload is not in INITIATED state");
    }

    List<CompletedPart> parts = validateAndMapParts(u, req);

    try {
      s3.completeMultipartUpload(u.getBucket(), u.getObjectKey(), u.getS3UploadId(), parts);
    } catch (SdkException ex) {
      u.setStatus("FAILED");
      u.setUpdatedAt(OffsetDateTime.now());
      repo.save(u);
      throw new UpstreamException("Failed to complete multipart upload in S3", ex);
    }

    u.setStatus("COMPLETED");
    u.setCompletedAt(OffsetDateTime.now());
    u.setUpdatedAt(OffsetDateTime.now());
    repo.save(u);
  }

  @Transactional
  public void abort(Jwt jwt, UUID uploadSessionId) {
    UploadEntity u = repo.findById(uploadSessionId).orElseThrow(() -> new NotFoundException("Upload not found"));
    requireOwner(jwt, u);

    if ("COMPLETED".equals(u.getStatus())) {
      throw new ConflictException("Cannot abort a COMPLETED upload");
    }
    if ("ABORTED".equals(u.getStatus())) {
      return;
    }

    try {
      s3.abortMultipartUpload(u.getBucket(), u.getObjectKey(), u.getS3UploadId());
    } catch (SdkException ex) {
      throw new UpstreamException("Failed to abort multipart upload in S3", ex);
    }

    u.setStatus("ABORTED");
    u.setUpdatedAt(OffsetDateTime.now());
    repo.save(u);
  }

  @Transactional(readOnly = true)
  public UploadDto get(Jwt jwt, UUID uploadSessionId) {
    UploadEntity u = repo.findById(uploadSessionId).orElseThrow(() -> new NotFoundException("Upload not found"));
    requireOwner(jwt, u);
    return toDto(u);
  }

  @Transactional(readOnly = true)
  public List<UploadDto> listMine(Jwt jwt) {
    return repo.findTop50ByUserSubOrderByCreatedAtDesc(jwt.getSubject()).stream()
      .map(this::toDto)
      .toList();
  }

  private void validateCreate(CreateUploadRequest req) {
    if (req.getFileSize() > uploadPolicy.getMaxFileSizeBytes()) {
      throw new BadRequestException("File size exceeds maxFileSizeBytes");
    }
    if (!contentTypeAllowlist.isAllowed(req.getContentType(), uploadPolicy.getAllowedContentTypes())) {
      throw new BadRequestException("Content-Type is not allowed");
    }
  }

  private static String normalizeIdempotencyKey(String k) {
    if (k == null) return null;
    String v = k.trim();
    return v.isBlank() ? null : v;
  }

  private static int calcPartCount(long fileSize, long partSize) {
    return (int) ((fileSize + partSize - 1) / partSize);
  }

  private static void requireOwner(Jwt jwt, UploadEntity u) {
    if (!Objects.equals(jwt.getSubject(), u.getUserSub())) {
      throw new ForbiddenException("Not owner of upload");
    }
  }

  private List<CompletedPart> validateAndMapParts(UploadEntity u, CompleteUploadRequest req) {
    if (req.getParts() == null || req.getParts().isEmpty()) {
      throw new BadRequestException("Parts list is required");
    }

    // Validate uniqueness and range
    Set<Integer> seen = new HashSet<>();
    for (CompletedPartDto p : req.getParts()) {
      int pn = p.getPartNumber();
      if (pn < 1 || pn > u.getPartCount()) {
        throw new BadRequestException("Invalid partNumber: " + pn);
      }
      if (!seen.add(pn)) {
        throw new BadRequestException("Duplicate partNumber: " + pn);
      }
      if (p.getETag() == null || p.getETag().isBlank()) {
        throw new BadRequestException("Missing ETag for partNumber: " + pn);
      }
    }

    // In strict mode, we require all parts.
    if (seen.size() != u.getPartCount()) {
      throw new BadRequestException("Expected " + u.getPartCount() + " parts, got " + seen.size());
    }

    return req.getParts().stream()
      .sorted(Comparator.comparingInt(CompletedPartDto::getPartNumber))
      .map(p -> CompletedPart.builder()
        .partNumber(p.getPartNumber())
        .eTag(normalizeEtag(p.getETag()))
        .build())
      .toList();
  }

  private static String normalizeEtag(String etag) {
    String e = etag.trim();
    if (e.startsWith("\"") && e.endsWith("\"") && e.length() >= 2) {
      return e.substring(1, e.length() - 1);
    }
    return e;
  }

  private CreateUploadResponse toCreateResponse(UploadEntity u, String baseUrl) {
    return CreateUploadResponse.builder()
      .uploadId(u.getId())
      .objectKey(u.getObjectKey())
      .partSize(u.getPartSize())
      .partCount(u.getPartCount())
      .expiresAt(OffsetDateTime.now().plusMinutes(s3Props.getPresignExpirationMinutes()))
      .partUrlEndpoint(baseUrl + "/api/uploads/" + u.getId() + "/parts/{partNumber}/url")
      .build();
  }

  private UploadDto toDto(UploadEntity u) {
    return UploadDto.builder()
      .id(u.getId())
      .objectKey(u.getObjectKey())
      .fileName(u.getFileName())
      .contentType(u.getContentType())
      .fileSize(u.getFileSize())
      .status(u.getStatus())
      .partSize(u.getPartSize())
      .partCount(u.getPartCount())
      .createdAt(u.getCreatedAt())
      .completedAt(u.getCompletedAt())
      .build();
  }
}
