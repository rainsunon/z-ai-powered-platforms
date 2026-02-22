package com.xrs.booking;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Utility class for parsing JSON responses in tests without requiring a full JSON library.
 */
public final class JsonTestUtils {

  private JsonTestUtils() {}

  private static final Pattern ID_PATTERN = Pattern.compile("\"id\"\\s*:\\s*\"([^\"]+)\"");

  /**
   * Extracts the "id" field value from a JSON response string.
   *
   * @param json the JSON response body
   * @return the UUID extracted from the id field
   * @throws IllegalArgumentException if the id field is not found or is invalid
   */
  public static UUID extractId(String json) {
    if (json == null || json.isEmpty()) {
      throw new IllegalArgumentException("JSON response is null or empty");
    }
    
    Matcher matcher = ID_PATTERN.matcher(json);
    if (!matcher.find()) {
      throw new IllegalArgumentException("No 'id' field found in JSON: " + json);
    }
    
    try {
      return UUID.fromString(matcher.group(1));
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Invalid UUID format in 'id' field: " + matcher.group(1), e);
    }
  }

  /**
   * Checks if a JSON response contains a specific field/value pair.
   *
   * @param json the JSON response
   * @param field the field name to check
   * @param value the expected value
   * @return true if the field contains the value
   */
  public static boolean containsField(String json, String field, String value) {
    if (json == null || field == null || value == null) {
      return false;
    }
    String pattern = "\"" + field + "\"\\s*:\\s*\"" + Pattern.quote(value) + "\"";
    return Pattern.compile(pattern).matcher(json).find();
  }
}
