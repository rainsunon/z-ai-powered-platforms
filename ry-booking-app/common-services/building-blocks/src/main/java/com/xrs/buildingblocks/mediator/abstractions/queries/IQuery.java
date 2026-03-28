package com.xrs.buildingblocks.mediator.abstractions.queries;


import com.xrs.buildingblocks.mediator.abstractions.requests.IRequest;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public interface IQuery<TResponse> extends IBaseQuery, IRequest<TResponse> {}