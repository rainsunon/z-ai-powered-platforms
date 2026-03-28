package com.xrs.buildingblocks.mediator.abstractions.notifications;


/**
 * @author Rui S.
 * @date 2026-02-02
 * @apiNote
 */
public interface INotificationHandler<TNotification extends INotification> {

    Void handle(TNotification notification);
}