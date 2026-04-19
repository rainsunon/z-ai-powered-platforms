package com.xrs.paymentservice.config;

import com.xrs.commonlib.cqrs.CommandBus;
import com.xrs.commonlib.cqrs.QueryBus;
import com.xrs.paymentservice.command.ProcessPaymentCommand;
import com.xrs.paymentservice.command.RefundPaymentCommand;
import com.xrs.paymentservice.command.UpdatePaymentCommand;
import com.xrs.paymentservice.query.GetPaymentQuery;
import com.xrs.paymentservice.query.ListPaymentsQuery;
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
            ProcessPaymentCommand.ProcessPaymentHandler processPaymentHandler,
            RefundPaymentCommand.RefundPaymentHandler refundPaymentHandler,
            UpdatePaymentCommand.UpdatePaymentHandler updatePaymentHandler) {
        
        CommandBus commandBus = new CommandBus();
        
        // Register command handlers
        commandBus.register(ProcessPaymentCommand.class, processPaymentHandler);
        commandBus.register(RefundPaymentCommand.class, refundPaymentHandler);
        commandBus.register(UpdatePaymentCommand.class, updatePaymentHandler);
        
        return commandBus;
    }

    /**
     * Configure QueryBus with query handlers.
     */
    @Bean
    public QueryBus queryBus(
            GetPaymentQuery.GetPaymentHandler getPaymentHandler,
            ListPaymentsQuery.ListPaymentsHandler listPaymentsHandler) {
        
        QueryBus queryBus = new QueryBus();
        
        // Register query handlers
        queryBus.register(GetPaymentQuery.class, getPaymentHandler);
        queryBus.register(ListPaymentsQuery.class, listPaymentsHandler);
        
        return queryBus;
    }
}
