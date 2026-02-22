package com.xrs.gateway.uploads.service;

import com.xrs.gateway.config.S3Properties;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedUploadPartRequest;

/**
 * AWS SDK v2 implementation for S3 multipart upload calls.
 */
@Component
@RequiredArgsConstructor
public class AwsS3MultipartOperations implements S3MultipartOperations {

  private final S3Client s3;
  private final S3Presigner presigner;
  private final S3Properties props;

  @Override
  public String createMultipartUpload(String bucket, String key, String contentType) {
    CreateMultipartUploadRequest.Builder req = CreateMultipartUploadRequest.builder()
      .bucket(bucket)
      .key(key)
      .contentType(contentType);

    applySse(req);

    CreateMultipartUploadResponse resp = s3.createMultipartUpload(req.build());
    return resp.uploadId();
  }

  @Override
  public String presignUploadPartUrl(String bucket, String key, String uploadId, int partNumber) {
    var presigned = presigner.presignUploadPart(
      software.amazon.awssdk.services.s3.presigner.model.UploadPartPresignRequest.builder()
        .uploadPartRequest(
          UploadPartRequest.builder()
            .bucket(bucket)
            .key(key)
            .uploadId(uploadId)
            .partNumber(partNumber)
            .build()
        )
        .signatureDuration(Duration.ofMinutes(props.getPresignExpirationMinutes()))
        .build()
    );
    return presigned.url().toString();
  }

  @Override
  public void completeMultipartUpload(String bucket, String key, String uploadId, List<CompletedPart> parts) {
    CompletedMultipartUpload cmu = CompletedMultipartUpload.builder().parts(parts).build();
    s3.completeMultipartUpload(
      CompleteMultipartUploadRequest.builder()
        .bucket(bucket)
        .key(key)
        .uploadId(uploadId)
        .multipartUpload(cmu)
        .build()
    );
  }

  @Override
  public void abortMultipartUpload(String bucket, String key, String uploadId) {
    s3.abortMultipartUpload(
      AbortMultipartUploadRequest.builder()
        .bucket(bucket)
        .key(key)
        .uploadId(uploadId)
        .build()
    );
  }

  private void applySse(CreateMultipartUploadRequest.Builder req) {
    if (props.getSse() == null) {
      return;
    }
    switch (props.getSse()) {
      case AES256 -> req.serverSideEncryption(ServerSideEncryption.AES256);
      case AWS_KMS -> {
        req.serverSideEncryption(ServerSideEncryption.AWS_KMS);
        if (props.getKmsKeyId() != null && !props.getKmsKeyId().isBlank()) {
          req.ssekmsKeyId(props.getKmsKeyId());
        }
      }
      case NONE -> { /* no-op */ }
    }
  }
}
