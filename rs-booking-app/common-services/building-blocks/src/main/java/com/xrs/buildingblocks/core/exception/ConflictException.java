package com.xrs.buildingblocks.core.exception;


import org.springframework.http.HttpStatus;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */

public class ConflictException extends CustomException {
    public ConflictException(String message, Integer code) {
        super(message, HttpStatus.CONFLICT, code);
    }

    public ConflictException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}