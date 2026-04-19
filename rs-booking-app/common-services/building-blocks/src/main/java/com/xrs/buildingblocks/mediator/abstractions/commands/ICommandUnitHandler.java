package com.xrs.buildingblocks.mediator.abstractions.commands;
import com.xrs.buildingblocks.mediator.abstractions.requests.Unit;

/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public interface ICommandUnitHandler<TCommand extends ICommandUnit> extends ICommandHandler<TCommand, Unit> {}