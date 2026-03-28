package com.xrs.asset.exception;

import jakarta.servlet.http.HttpServletRequest;
import com.xrs.asset.errors.ApiResponse;
import com.xrs.asset.errors.ApiReturnCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class ExceptionHandlerAdvice {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse> handleBusinessException(HttpServletRequest req, BusinessException ex) {
        ApiResponse response = new ApiResponse(
                ex.getCode(),
                ex.getCode().name(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, ex.getCode().getHttpStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        Map<String, Object> body = new HashMap<>();
        body.put("code", ApiReturnCode.BAD_REQUEST.getCode());
        body.put("error", ApiReturnCode.BAD_REQUEST.name());
        body.put("message", errors);
        body.put("data", null);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", HttpStatus.FORBIDDEN.value());
        body.put("error", "FORBIDDEN");
        body.put("message", ex.getMessage());
        body.put("data", null);

        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGenericException(HttpServletRequest req, Exception ex) {
        ApiResponse response = new ApiResponse(
                ApiReturnCode.INTERNAL_ERROR,
                ApiReturnCode.INTERNAL_ERROR.name(),
                ex.getMessage(),
                null
        );
        return new ResponseEntity<>(response, ApiReturnCode.INTERNAL_ERROR.getHttpStatus());
    }
}