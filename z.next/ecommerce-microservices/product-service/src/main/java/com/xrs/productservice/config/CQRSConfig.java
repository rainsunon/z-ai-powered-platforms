package com.xrs.productservice.config;

import com.xrs.commonlib.cqrs.CommandBus;
import com.xrs.commonlib.cqrs.QueryBus;
import com.xrs.productservice.handler.CreateProductHandler;
import com.xrs.productservice.handler.GetProductHandler;
import com.xrs.productservice.handler.ListProductsHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for CQRS pattern.
 * Registers all command and query handlers with their respective buses.
 */
@Configuration
@RequiredArgsConstructor
public class CQRSConfig {
    
    private final CommandBus commandBus;
    private final QueryBus queryBus;
    private final CreateProductHandler createProductHandler;
    private final GetProductHandler getProductHandler;
    private final ListProductsHandler listProductsHandler;
    
    @org.springframework.context.annotation.Bean
    public void registerHandlers() {
        // Register command handlers
        commandBus.registerHandler(com.xrs.productservice.command.CreateProductCommand.class, createProductHandler);
        
        // Register query handlers
        queryBus.registerHandler(com.xrs.productservice.query.GetProductQuery.class, getProductHandler);
        queryBus.registerHandler(com.xrs.productservice.query.ListProductsQuery.class, listProductsHandler);
    }
}
