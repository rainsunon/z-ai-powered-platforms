package com.xrs.buildingblocks.mediator.abstractions;


import com.xrs.buildingblocks.mediator.abstractions.commands.ICommand;
import com.xrs.buildingblocks.mediator.abstractions.queries.IQuery;
import com.xrs.buildingblocks.mediator.abstractions.requests.IRequest;

/**
 * @author Rui S.
 * @date 2026-02-01
 * @apiNote
 */

public interface ISender {

    <TResponse> TResponse send(IRequest<TResponse> request);

    <TResponse> TResponse send(ICommand<TResponse> command);

    <TResponse> TResponse send(IQuery<TResponse> query);
}