package com.xrs.gateway.web.errors;

/** 403 Forbidden. */
public class ForbiddenException extends RuntimeException {
  public ForbiddenException(String message) { super(message); }
}
