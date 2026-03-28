package com.xrs.buildingblocks.mediator.behaviors;


import com.xrs.buildingblocks.core.event.DomainEvent;
import com.xrs.buildingblocks.core.event.EventDispatcher;
import com.xrs.buildingblocks.mediator.abstractions.requests.IPipelineBehavior;
import com.xrs.buildingblocks.mediator.abstractions.requests.IRequest;
import com.xrs.buildingblocks.mediator.abstractions.requests.RequestHandlerDelegate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.slf4j.Logger;

import java.util.List;

/**
 * @author Rui S.
 * @date 2026-02-07
 * @apiNote
 */
public class TransactionPipelineBehavior<TRequest extends IRequest<TResponse>, TResponse> implements IPipelineBehavior<TRequest, TResponse> {

    private final TransactionTemplate transactionTemplate;
    private final Logger logger;
    private final EventDispatcher eventDispatcher;

    public TransactionPipelineBehavior(
            PlatformTransactionManager platformTransactionManager,
            Logger logger,
            EventDispatcher eventDispatcher) {
        this.transactionTemplate = new TransactionTemplate(platformTransactionManager);
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
    }

    @Override
    public TResponse handle(TRequest request, RequestHandlerDelegate<TResponse> next) {

        return transactionTemplate.execute(status -> {
            TResponse response = null;

            try {
                response = next.handle();

                List<DomainEvent> domainEvents = this.eventDispatcher.getDomainEvents();

                domainEvents.forEach(domainEvent -> {
                    this.eventDispatcher.send(domainEvents, request.getClass());

                    this.eventDispatcher.clearDomainEvents();

                    logger.info("Transaction successfully committed.");
                });

                return response;
            } catch (Exception ex) {
                status.setRollbackOnly();
                this.eventDispatcher.clearDomainEvents();
                logger.error("Transaction is rolled back.", ex);
                throw ex;
            }
        });
    }
}