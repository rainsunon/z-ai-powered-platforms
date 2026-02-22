package com.xrs.commonlib.cqrs;

import reactor.core.publisher.Mono;

/**
 * Generic interface for handling Commands in the CQRS pattern.
 * Command handlers are responsible for executing commands and returning results.
 * 
 * @param <C> the type of command this handler processes
 * @param <R> the type of result returned by this handler
 */
@FunctionalInterface
public interface CommandHandler<C extends Command, R> {
    
    /**
     * Handle the command and return the result.
     * This method should be idempotent when possible.
     * 
     * @param command the command to handle
     * @return a Mono emitting the result of handling the command
     */
    Mono<R> handle(C command);
    
    /**
     * Get the type of command this handler processes.
     * Used for routing commands to appropriate handlers.
     * 
     * @return the command class
     */
    default Class<C> getCommandType() {
        throw new UnsupportedOperationException("Command type must be specified by implementation");
    }
}
