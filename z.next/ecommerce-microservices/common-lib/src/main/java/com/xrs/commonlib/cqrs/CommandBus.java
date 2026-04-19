package com.xrs.commonlib.cqrs;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CommandBus routes commands to their appropriate handlers.
 * Implements the mediator pattern for command handling.
 */
@Component
@Slf4j
public class CommandBus {
    
    private final Map<Class<? extends Command>, CommandHandler<?, ?>> handlers = new ConcurrentHashMap<>();
    
    /**
     * Register a command handler for a specific command type.
     * 
     * @param commandType the command class
     * @param handler the handler instance
     * @param <C> the command type
     * @param <R> the result type
     */
    public <C extends Command, R> void registerHandler(Class<C> commandType, CommandHandler<C, R> handler) {
        handlers.put(commandType, handler);
        log.debug("Registered handler for command type: {}", commandType.getSimpleName());
    }
    
    /**
     * Dispatch a command to its registered handler.
     * 
     * @param command the command to dispatch
     * @param <C> the command type
     * @param <R> the result type
     * @return a Mono emitting the result
     */
    @SuppressWarnings("unchecked")
    public <C extends Command, R> Mono<R> dispatch(C command) {
        command.validate();
        
        CommandHandler<C, R> handler = (CommandHandler<C, R>) handlers.get(command.getClass());
        
        if (handler == null) {
            log.error("No handler registered for command type: {}", command.getClass().getSimpleName());
            return Mono.error(new IllegalStateException(
                "No handler registered for command type: " + command.getClass().getSimpleName()
            ));
        }
        
        log.debug("Dispatching command: {} with ID: {}", command.getCommandType(), command.getCommandId());
        
        return Mono.defer(() -> handler.handle(command))
                .doOnSuccess(result -> log.debug("Command {} completed successfully", command.getCommandType()))
                .doOnError(error -> log.error("Command {} failed: {}", command.getCommandType(), error.getMessage()));
    }
    
    /**
     * Check if a handler is registered for the given command type.
     * 
     * @param commandType the command class
     * @return true if a handler is registered, false otherwise
     */
    public boolean hasHandler(Class<? extends Command> commandType) {
        return handlers.containsKey(commandType);
    }
}
