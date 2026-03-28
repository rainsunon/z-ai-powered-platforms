package com.xrs.buildingblocks.core.exception;


import org.springframework.http.HttpStatus;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public class NotFoundException extends CustomException {
    public NotFoundException(String message, Integer code) {
        super(message, HttpStatus.NOT_FOUND, code);
    }

    public NotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }
}