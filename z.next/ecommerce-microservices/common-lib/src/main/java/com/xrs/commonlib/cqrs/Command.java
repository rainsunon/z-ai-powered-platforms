package com.xrs.commonlib.cqrs;

import java.util.UUID;

/**
 * Marker interface for all Commands in the CQRS pattern.
 * Commands represent intents to change the system state.
 * All commands should be immutable and contain all necessary information for execution.
 */
public interface Command {
    
    /**
     * Unique identifier for this command instance.
     * Used for idempotency and tracing.
     * 
     * @return the command ID
     */
    default String getCommandId() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Type of the command for routing and logging.
     * 
     * @return the command type name
     */
    default String getCommandType() {
        return this.getClass().getSimpleName();
    }
    
    /**
     * Validate the command before execution.
     * 
     * @throws IllegalArgumentException if the command is invalid
     */
    default void validate() {
        // Default implementation - override in specific commands
    }
}
