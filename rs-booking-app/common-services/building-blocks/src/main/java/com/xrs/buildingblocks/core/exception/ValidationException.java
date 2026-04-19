package com.xrs.buildingblocks.core.exception;


/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public class ValidationException extends BadRequestException {
    public ValidationException(String message) {
        super(message);
    }
    public ValidationException(String message, Integer code) {
        super(message, code);
    }
}