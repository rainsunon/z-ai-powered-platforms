package com.xrs.buildingblocks.mediator.abstractions.commands;

import com.xrs.buildingblocks.mediator.abstractions.requests.IRequest;
/**
 * @author Rui S.
 * @date 2026-02-01
 * @apiNote
 */

public interface ICommand<TResponse> extends IRequest<TResponse>, IBaseCommand {}