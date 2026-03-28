
package com.xrs.buildingblocks.core.outboxprocessor;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.slf4j.Logger;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.concurrent.ScheduledFuture;

@Configuration      
@Import({ PersistMessageProcessorConfiguration.class })
public class PersistMessageBackgroundJob {

    private final TaskScheduler taskScheduler;
    private final PersistMessageProcessor persistMessageProcessor;
    private final Logger logger;
    private final TransactionTemplate transactionTemplate;
    private ScheduledFuture<?> scheduledTask;

    public PersistMessageBackgroundJob(
            TaskScheduler taskScheduler,
            PersistMessageProcessor persistMessageProcessor,
            Logger logger,
            PlatformTransactionManager transactionManager) {
        this.taskScheduler = taskScheduler;
        this.persistMessageProcessor = persistMessageProcessor;
        this.logger = logger;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    @PostConstruct
    public void startBackgroundJob() {
        scheduledTask = taskScheduler.scheduleAtFixedRate(() -> {
            try {
                transactionTemplate.execute(status -> {
                    persistMessageProcessor.processAll();
                    return null;
                });
            } catch (Exception ex) {
                logger.error("Error in persistent message processing", ex);
            }
        }, 1000);
    }

    @PreDestroy
    public void stopBackgroundJob() {
        if (scheduledTask != null) {
            scheduledTask.cancel(true);
        }
    }
}