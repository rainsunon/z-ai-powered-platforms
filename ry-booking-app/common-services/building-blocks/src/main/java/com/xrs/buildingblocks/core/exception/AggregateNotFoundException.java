package com.xrs.buildingblocks.core.exception;


/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public class AggregateNotFoundException extends RuntimeException {
    public AggregateNotFoundException(String typeName, String id) {
        super(typeName + " with id '" + id + "' was not found");
    }

    public static <T> AggregateNotFoundException forType(Class<T> type, String id) {
        return new AggregateNotFoundException(type.getSimpleName(), id);
    }
}