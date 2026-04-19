package com.xrs.inventoryservice.config;

import com.xrs.commonlib.cqrs.CommandBus;
import com.xrs.commonlib.cqrs.QueryBus;
import com.xrs.inventoryservice.command.ReserveInventoryCommand;
import com.xrs.inventoryservice.command.ReleaseInventoryCommand;
import com.xrs.inventoryservice.command.UpdateInventoryCommand;
import com.xrs.inventoryservice.query.GetInventoryQuery;
import com.xrs.inventoryservice.query.ListInventoryQuery;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for CQRS pattern.
 * Registers command and query handlers with their respective buses.
 */
@Configuration
public class CQRSConfig {

    /**
     * Configure CommandBus with command handlers.
     */
    @Bean
    public CommandBus commandBus(
            ReserveInventoryCommand.ReserveInventoryHandler reserveInventoryHandler,
            ReleaseInventoryCommand.ReleaseInventoryHandler releaseInventoryHandler,
            UpdateInventoryCommand.UpdateInventoryHandler updateInventoryHandler) {
        
        CommandBus commandBus = new CommandBus();
        
        // Register command handlers
        commandBus.register(ReserveInventoryCommand.class, reserveInventoryHandler);
        commandBus.register(ReleaseInventoryCommand.class, releaseInventoryHandler);
        commandBus.register(UpdateInventoryCommand.class, updateInventoryHandler);
        
        return commandBus;
    }

    /**
     * Configure QueryBus with query handlers.
     */
    @Bean
    public QueryBus queryBus(
            GetInventoryQuery.GetInventoryHandler getInventoryHandler,
            ListInventoryQuery.ListInventoryHandler listInventoryHandler) {
        
        QueryBus queryBus = new QueryBus();
        
        // Register query handlers
        queryBus.register(GetInventoryQuery.class, getInventoryHandler);
        queryBus.register(ListInventoryQuery.class, listInventoryHandler);
        
        return queryBus;
    }
}
