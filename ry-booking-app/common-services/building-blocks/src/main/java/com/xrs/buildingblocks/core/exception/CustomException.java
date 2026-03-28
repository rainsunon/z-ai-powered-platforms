package com.xrs.buildingblocks.core.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
@Getter
public class CustomException extends RuntimeException {
    private final HttpStatus statusCode;
    private final Integer code;

    public CustomException(String message) {
        this(message, HttpStatus.BAD_REQUEST, null);
    }

    public CustomException(String message, HttpStatus statusCode) {
        this(message, statusCode, null);
    }

    public CustomException(String message, Integer code) {
        this(message, HttpStatus.BAD_REQUEST, code);
    }

    public CustomException(String message, HttpStatus statusCode, Integer code) {
        super(message);
        this.statusCode = statusCode != null ? statusCode : HttpStatus.BAD_REQUEST;
        this.code = code;
    }

    public CustomException(String message, Exception innerException) {
        this(message, innerException, HttpStatus.BAD_REQUEST, null);
    }

    public CustomException(String message, Exception innerException, HttpStatus statusCode) {
        this(message, innerException, statusCode, null);
    }

    public CustomException(String message, Exception innerException, Integer code) {
        this(message, innerException, HttpStatus.BAD_REQUEST, code);
    }

    public CustomException(String message, Exception innerException, HttpStatus statusCode, Integer code) {
        super(message, innerException);
        this.statusCode = statusCode != null ? statusCode : HttpStatus.BAD_REQUEST;
        this.code = code;
    }

    public CustomException() {
        this(HttpStatus.BAD_REQUEST, null);
    }

    public CustomException(HttpStatus statusCode) {
        this(statusCode, null);
    }

    public CustomException(HttpStatus statusCode, Integer code) {
        super();
        this.statusCode = statusCode != null ? statusCode : HttpStatus.BAD_REQUEST;
        this.code = code;
    }

}