package com.xrs.gateway.uploads.service;

import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Component;

/**
 * Matches content types against an allowlist supporting wildcards like {@code video/*}.
 */
@Component
public class ContentTypeAllowlist {

  public boolean isAllowed(String contentType, List<String> allowedPatterns) {
    if (contentType == null || contentType.isBlank()) {
      return false;
    }
    String ct = contentType.toLowerCase(Locale.ROOT).trim();
    for (String p : allowedPatterns) {
      if (p == null || p.isBlank()) continue;
      String pattern = p.toLowerCase(Locale.ROOT).trim();
      if (pattern.equals("*/*")) return true;
      if (pattern.endsWith("/*")) {
        String prefix = pattern.substring(0, pattern.length() - 1);
        if (ct.startsWith(prefix)) return true;
      } else if (ct.equals(pattern)) {
        return true;
      }
    }
    return false;
  }
}
