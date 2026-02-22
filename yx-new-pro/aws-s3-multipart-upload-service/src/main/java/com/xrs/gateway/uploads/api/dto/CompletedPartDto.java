package com.xrs.gateway.uploads.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Part completion info returned by browser (ETag).
 */
@Data
public class CompletedPartDto {

  @Min(1)
  private int partNumber;

  @NotBlank
  private String eTag;
}
