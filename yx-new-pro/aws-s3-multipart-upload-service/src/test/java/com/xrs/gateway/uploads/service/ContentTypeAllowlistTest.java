package com.xrs.gateway.uploads.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import org.junit.jupiter.api.Test;

class ContentTypeAllowlistTest {

  private final ContentTypeAllowlist allowlist = new ContentTypeAllowlist();

  @Test
  void matchesWildcard() {
    assertTrue(allowlist.isAllowed("video/mp4", List.of("video/*")));
    assertFalse(allowlist.isAllowed("application/json", List.of("video/*")));
  }

  @Test
  void matchesExact() {
    assertTrue(allowlist.isAllowed("application/octet-stream", List.of("application/octet-stream")));
    assertFalse(allowlist.isAllowed("application/octet-stream", List.of("application/pdf")));
  }
}
