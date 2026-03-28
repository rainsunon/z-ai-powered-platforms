package com.xrs.buildingblocks.core.exception;


import org.springframework.http.HttpStatus;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public class BadRequestException extends CustomException {
    public BadRequestException(String message, Integer code) {
        super(message, HttpStatus.BAD_REQUEST, code);
    }

    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}