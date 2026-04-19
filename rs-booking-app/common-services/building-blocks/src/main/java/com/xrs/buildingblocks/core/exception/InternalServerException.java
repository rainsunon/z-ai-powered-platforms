package com.xrs.buildingblocks.core.exception;


import org.springframework.http.HttpStatus;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public class InternalServerException extends CustomException {

    public InternalServerException(String message, Integer code) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, code);
    }

    public InternalServerException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public InternalServerException(String message, Integer code, Object... args) {
        super(String.format(message, args), HttpStatus.INTERNAL_SERVER_ERROR, code);
    }
}