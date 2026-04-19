package com.xrs.buildingblocks.mediator.abstractions.commands;


import com.xrs.buildingblocks.mediator.abstractions.requests.IRequestHandler;

/**
 * @author Rui S.
 * @date 2026-02-01
 * @apiNote
 */
public interface ICommandHandler<TCommand extends ICommand<TResponse>, TResponse>
        extends IRequestHandler<TCommand, TResponse> {
    TResponse handle(TCommand command);
}