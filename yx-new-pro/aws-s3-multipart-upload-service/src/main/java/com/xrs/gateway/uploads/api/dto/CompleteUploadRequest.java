package com.xrs.gateway.uploads.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Data;

/**
 * Complete a multipart upload.
 */
@Data
public class CompleteUploadRequest {

  @Valid
  @NotEmpty
  private List<CompletedPartDto> parts;
}
