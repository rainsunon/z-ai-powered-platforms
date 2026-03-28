package com.github.dimitryivaniuta.multitenant.error;

import com.github.dimitryivaniuta.multitenant.service.UserNotFoundException;
import com.github.dimitryivaniuta.multitenant.tenant.MissingTenantException;
import com.github.dimitryivaniuta.multitenant.observability.MdcKeys;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.slf4j.MDC;

/**
 * Centralized exception -> RFC7807 ProblemDetail mapping.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

  private static void enrich(ProblemDetail pd, HttpServletRequest req) {
    pd.setProperty("path", req.getRequestURI());
    String corr = MDC.get(MdcKeys.CORRELATION_ID);
    if (corr != null && !corr.isBlank()) {
      pd.setProperty("correlationId", corr);
    }
    String tenant = MDC.get(MdcKeys.TENANT_ID);
    if (tenant != null && !tenant.isBlank()) {
      pd.setProperty("tenantId", tenant);
    }
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ProblemDetail handleNotFound(UserNotFoundException ex, HttpServletRequest req) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    pd.setTitle("Not Found");
    pd.setType(URI.create("https://errors.example.com/not-found"));
    enrich(pd, req);
    return pd;
  }

  @ExceptionHandler(MissingTenantException.class)
  public ProblemDetail handleMissingTenant(MissingTenantException ex, HttpServletRequest req) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    pd.setTitle("Tenant Required");
    pd.setType(URI.create("https://errors.example.com/tenant-required"));
    enrich(pd, req);
    return pd;
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ProblemDetail handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
    pd.setTitle("Bad Request");
    pd.setType(URI.create("https://errors.example.com/validation"));
    enrich(pd, req);
    pd.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
        .map(fe -> Map.of(
            "field", fe.getField(),
            "message", fe.getDefaultMessage()
        ))
        .toList());
    return pd;
  }

  @ExceptionHandler(Exception.class)
  public ProblemDetail handleGeneric(Exception ex, HttpServletRequest req) {
    // Let Spring Security / framework exceptions pass through if they are already mapped.
    if (ex instanceof ErrorResponseException err) {
      return err.getBody();
    }

    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error");
    pd.setTitle("Internal Server Error");
    pd.setType(URI.create("https://errors.example.com/internal"));
    enrich(pd, req);
    return pd;
  }
}
