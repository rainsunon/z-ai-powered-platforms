package com.xrs.buildingblocks.mediator.abstractions.requests;


/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public interface IRequestHandler<TRequest extends IRequest<TResponse>, TResponse> {
    TResponse handle(TRequest request);
}