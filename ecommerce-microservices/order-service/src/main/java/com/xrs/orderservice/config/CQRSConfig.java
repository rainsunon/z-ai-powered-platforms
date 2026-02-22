package com.xrs.orderservice.config;

import com.xrs.commonlib.cqrs.CommandBus;
import com.xrs.commonlib.cqrs.QueryBus;
import com.xrs.orderservice.command.CreateOrderCommand;
import com.xrs.orderservice.command.UpdateOrderCommand;
import com.xrs.orderservice.command.DeleteOrderCommand;
import com.xrs.orderservice.query.GetOrderQuery;
import com.xrs.orderservice.query.ListOrdersQuery;
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
            CreateOrderCommand.CreateOrderHandler createOrderHandler,
            UpdateOrderCommand.UpdateOrderHandler updateOrderHandler,
            DeleteOrderCommand.DeleteOrderHandler deleteOrderHandler) {
        
        CommandBus commandBus = new CommandBus();
        
        // Register command handlers
        commandBus.register(CreateOrderCommand.class, createOrderHandler);
        commandBus.register(UpdateOrderCommand.class, updateOrderHandler);
        commandBus.register(DeleteOrderCommand.class, deleteOrderHandler);
        
        return commandBus;
    }

    /**
     * Configure QueryBus with query handlers.
     */
    @Bean
    public QueryBus queryBus(
            GetOrderQuery.GetOrderHandler getOrderHandler,
            ListOrdersQuery.ListOrdersHandler listOrdersHandler) {
        
        QueryBus queryBus = new QueryBus();
        
        // Register query handlers
        queryBus.register(GetOrderQuery.class, getOrderHandler);
        queryBus.register(ListOrdersQuery.class, listOrdersHandler);
        
        return queryBus;
    }
}
