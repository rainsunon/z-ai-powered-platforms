package com.xrs.gateway.web.errors;

/**
 * Signals a failure when talking to an upstream service (e.g. S3).
 */
public class UpstreamException extends RuntimeException {
  public UpstreamException(String message, Throwable cause) { super(message, cause); }
}
