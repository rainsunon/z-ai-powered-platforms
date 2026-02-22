package com.xrs.gateway.web;

import com.xrs.gateway.web.errors.*;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.stream.Collectors;

/**
 * Centralized exception-to-RFC7807 ProblemDetail mapping.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ProblemDetail validation(MethodArgumentNotValidException ex) {
    String msg = ex.getBindingResult().getFieldErrors().stream()
      .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
      .collect(Collectors.joining(", "));
    return pd(HttpStatus.BAD_REQUEST, "validation_failed", msg);
  }

  @ExceptionHandler(BadRequestException.class)
  public ProblemDetail badRequest(BadRequestException ex) {
    return pd(HttpStatus.BAD_REQUEST, "bad_request", ex.getMessage());
  }

  @ExceptionHandler(ForbiddenException.class)
  public ProblemDetail forbidden(ForbiddenException ex) {
    return pd(HttpStatus.FORBIDDEN, "forbidden", ex.getMessage());
  }

  @ExceptionHandler(NotFoundException.class)
  public ProblemDetail notFound(NotFoundException ex) {
    return pd(HttpStatus.NOT_FOUND, "not_found", ex.getMessage());
  }

  @ExceptionHandler(ConflictException.class)
  public ProblemDetail conflict(ConflictException ex) {
    return pd(HttpStatus.CONFLICT, "conflict", ex.getMessage());
  }

  @ExceptionHandler(UpstreamException.class)
  public ProblemDetail upstream(UpstreamException ex) {
    return pd(HttpStatus.BAD_GATEWAY, "upstream_error", ex.getMessage());
  }

  @ExceptionHandler(Exception.class)
  public ProblemDetail any(Exception ex) {
    return pd(HttpStatus.INTERNAL_SERVER_ERROR, "internal_error", ex.getMessage());
  }

  private ProblemDetail pd(HttpStatus status, String type, String detail) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail == null ? status.getReasonPhrase() : detail);
    pd.setTitle(status.getReasonPhrase());
    pd.setType(URI.create("urn:problem:" + type));
    // include correlation id for support
    String cid = MDC.get("correlationId");
    if (cid != null) {
      pd.setProperty("correlationId", cid);
    }
    return pd;
  }
}
