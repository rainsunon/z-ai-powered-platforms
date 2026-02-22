package com.xrs.gateway.uploads.service;

import java.util.List;
import software.amazon.awssdk.services.s3.model.CompletedPart;

/**
 * Abstraction over S3 multipart upload operations.
 *
 * <p>Kept as an interface so business logic can be unit-tested without AWS calls.</p>
 */
public interface S3MultipartOperations {

  String createMultipartUpload(String bucket, String key, String contentType);

  String presignUploadPartUrl(String bucket, String key, String uploadId, int partNumber);

  void completeMultipartUpload(String bucket, String key, String uploadId, List<CompletedPart> parts);

  void abortMultipartUpload(String bucket, String key, String uploadId);
}
