package com.xrs.buildingblocks.mediator.abstractions.queries;


import com.xrs.buildingblocks.mediator.abstractions.requests.IRequestHandler;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public interface IQueryHandler<TQuery extends IQuery<TResponse>, TResponse> extends IRequestHandler<TQuery, TResponse> {
    TResponse handle(TQuery query);
}