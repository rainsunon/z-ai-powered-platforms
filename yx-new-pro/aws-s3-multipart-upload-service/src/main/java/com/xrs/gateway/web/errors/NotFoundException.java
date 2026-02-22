package com.xrs.gateway.web.errors;

/** 404 Not found. */
public class NotFoundException extends RuntimeException {
  public NotFoundException(String message) { super(message); }
}
