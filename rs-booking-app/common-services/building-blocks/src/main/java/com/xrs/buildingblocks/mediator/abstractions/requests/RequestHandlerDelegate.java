package com.xrs.buildingblocks.mediator.abstractions.requests;


/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
@FunctionalInterface
public interface RequestHandlerDelegate<TResponse> {
    TResponse handle();
}
