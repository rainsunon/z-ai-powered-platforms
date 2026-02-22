package com.xrs.gateway.uploads.api;

import com.xrs.gateway.uploads.api.dto.*;
import com.xrs.gateway.uploads.service.UploadService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST API for multipart upload lifecycle.
 *
 * <p>Browser uploads parts directly to S3 using pre-signed URLs.</p>
 */
@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

  private final UploadService service;

  @PostMapping
  @PreAuthorize("hasRole('UPLOADER')")
  public CreateUploadResponse create(@AuthenticationPrincipal Jwt jwt,
                                     @Valid @RequestBody CreateUploadRequest req,
                                     HttpServletRequest http) {
    return service.create(jwt, req, baseUrl());
  }

  @GetMapping
  @PreAuthorize("hasRole('UPLOADER')")
  public List<UploadDto> listMine(@AuthenticationPrincipal Jwt jwt) {
    return service.listMine(jwt);
  }

  @GetMapping("/{uploadId}")
  @PreAuthorize("hasRole('UPLOADER')")
  public UploadDto get(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID uploadId) {
    return service.get(jwt, uploadId);
  }

  @GetMapping("/{uploadId}/parts/{partNumber}/url")
  @PreAuthorize("hasRole('UPLOADER')")
  public PresignedPartUrlResponse presignPart(@AuthenticationPrincipal Jwt jwt,
                                              @PathVariable UUID uploadId,
                                              @PathVariable int partNumber) {
    return service.presignPartUrl(jwt, uploadId, partNumber, baseUrl());
  }

  @PostMapping("/{uploadId}/complete")
  @PreAuthorize("hasRole('UPLOADER')")
  public void complete(@AuthenticationPrincipal Jwt jwt,
                       @PathVariable UUID uploadId,
                       @Valid @RequestBody CompleteUploadRequest req) {
    service.complete(jwt, uploadId, req);
  }

  @PostMapping("/{uploadId}/abort")
  @PreAuthorize("hasRole('UPLOADER')")
  public void abort(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID uploadId) {
    service.abort(jwt, uploadId);
  }

  private String baseUrl() {
    return ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
  }
}
