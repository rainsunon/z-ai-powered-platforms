package com.xrs.gateway.uploads.service;

import java.text.Normalizer;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Generates deterministic-ish S3 keys that avoid path traversal and unsafe characters.
 */
@Component
public class KeyGenerator {

  public String generate(String userSub, String originalFileName) {
    String safe = Normalizer.normalize(originalFileName, Normalizer.Form.NFKC)
      .replaceAll("[^a-zA-Z0-9._-]+", "_")
      .replaceAll("_+", "_")
      .replaceAll("^_+", "")
      .replaceAll("_+$", "");

    if (safe.isBlank()) {
      safe = "file";
    }

    return "users/" + userSub + "/uploads/" + UUID.randomUUID() + "/" + safe;
  }
}
