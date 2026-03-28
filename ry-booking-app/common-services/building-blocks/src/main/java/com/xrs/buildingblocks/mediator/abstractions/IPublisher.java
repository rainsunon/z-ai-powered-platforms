package com.xrs.buildingblocks.mediator.abstractions;


import com.xrs.buildingblocks.mediator.abstractions.notifications.INotification;
import org.springframework.lang.Nullable;

/**
 * @author Rui S.
 * @date 2026-02-01
 * @apiNote
 */
public interface IPublisher {
    @Nullable
    <TNotification extends INotification> Void publish(TNotification notification) throws Exception;
}