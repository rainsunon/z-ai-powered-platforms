package com.github.dimitryivaniuta.audittrail.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a requested resource does not exist.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

    /**
     * Creates an exception.
     *
     * @param message message
     */
    public NotFoundException(String message) {
        super(message);
    }
}
