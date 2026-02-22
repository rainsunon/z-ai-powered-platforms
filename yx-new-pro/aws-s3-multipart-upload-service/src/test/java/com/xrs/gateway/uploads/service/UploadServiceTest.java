package com.xrs.gateway.uploads.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.xrs.gateway.config.S3Properties;
import com.xrs.gateway.config.UploadPolicyProperties;
import com.xrs.gateway.uploads.api.dto.CreateUploadRequest;
import com.xrs.gateway.uploads.domain.UploadEntity;
import com.xrs.gateway.uploads.repo.UploadRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

@ExtendWith(MockitoExtension.class)
class UploadServiceTest {

  @Mock UploadRepository repo;
  @Mock S3MultipartOperations s3;

  private S3Properties s3Props;
  private UploadPolicyProperties policy;

  private UploadService service;

  @BeforeEach
  void setUp() {
    s3Props = new S3Properties();
    s3Props.setBucket("bucket");
    s3Props.setRegion("eu-central-1");
    s3Props.setPresignExpirationMinutes(20);
    s3Props.setPartSizeBytes(16L * 1024 * 1024);
    s3Props.setMaxPartCount(10_000);

    policy = new UploadPolicyProperties();
    policy.setMaxFileSizeBytes(3L * 1024 * 1024 * 1024);
    policy.setAllowedContentTypes(java.util.List.of("video/*", "application/octet-stream"));

    service = new UploadService(
      s3Props,
      policy,
      repo,
      s3,
      new KeyGenerator(),
      new ContentTypeAllowlist()
    );
  }

  @Test
  void createCalculatesPartsAndPersists() {
    Jwt jwt = jwt("user-1");

    CreateUploadRequest req = new CreateUploadRequest();
    req.setFileName("video.mp4");
    req.setContentType("video/mp4");
    req.setFileSize(100L * 1024 * 1024); // 100 MiB

    when(s3.createMultipartUpload(eq("bucket"), anyString(), eq("video/mp4"))).thenReturn("upload-123");
    when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

    var resp = service.create(jwt, req, "http://localhost:8081");

    assertNotNull(resp.getUploadId());
    assertEquals(16L * 1024 * 1024, resp.getPartSize());
    assertEquals(7, resp.getPartCount());

    verify(s3, times(1)).createMultipartUpload(eq("bucket"), anyString(), eq("video/mp4"));
    verify(repo, times(1)).save(any(UploadEntity.class));
  }

  @Test
  void idempotencyReturnsExistingInitiatedUpload() {
    Jwt jwt = jwt("user-1");

    CreateUploadRequest req = new CreateUploadRequest();
    req.setFileName("video.mp4");
    req.setContentType("video/mp4");
    req.setFileSize(10L * 1024 * 1024);
    req.setIdempotencyKey("abc");

    UploadEntity existing = UploadEntity.builder()
      .id(UUID.randomUUID())
      .userSub("user-1")
      .bucket("bucket")
      .objectKey("k")
      .s3UploadId("upload-xyz")
      .fileName("video.mp4")
      .contentType("video/mp4")
      .fileSize(10L * 1024 * 1024)
      .partSize(16L * 1024 * 1024)
      .partCount(1)
      .idempotencyKey("abc")
      .status("INITIATED")
      .createdAt(java.time.OffsetDateTime.now())
      .updatedAt(java.time.OffsetDateTime.now())
      .version(0)
      .build();

    when(repo.findByUserSubAndIdempotencyKey("user-1", "abc")).thenReturn(Optional.of(existing));

    var resp = service.create(jwt, req, "http://localhost:8081");

    assertEquals(existing.getId(), resp.getUploadId());
    verifyNoInteractions(s3);
    verify(repo, never()).save(any());
  }

  private static Jwt jwt(String sub) {
    return Jwt.withTokenValue("t")
      .header("alg", "none")
      .claim("sub", sub)
      .claim("preferred_username", "demo")
      .issuedAt(Instant.now())
      .expiresAt(Instant.now().plusSeconds(3600))
      .build();
  }
}
