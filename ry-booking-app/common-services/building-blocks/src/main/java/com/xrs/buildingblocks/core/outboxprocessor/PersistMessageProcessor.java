package com.xrs.buildingblocks.core.outboxprocessor;

import java.util.UUID;
import org.springframework.amqp.core.Message;
import com.xrs.buildingblocks.core.event.IntegrationEvent;
import com.xrs.buildingblocks.core.event.InternalCommand;

public interface PersistMessageProcessor {
    <T extends IntegrationEvent> void publishMessage(T message);

    <T extends InternalCommand> void addInternalMessage(T message);

    <T extends Message> UUID addReceivedMessage(T message);

    PersistMessageEntity existInboxMessage(UUID messageId);

    void process(UUID messageId, MessageDeliveryType deliveryType);

    void processAll();

    boolean messageIsPublished(Class<?> messageType);

    boolean messageIsDelivered(Class<?> messageType);
}