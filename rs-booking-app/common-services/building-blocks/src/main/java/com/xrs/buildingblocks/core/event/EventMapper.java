package com.xrs.buildingblocks.core.event;

public interface EventMapper {
    IntegrationEvent MapToIntegrationEvent(DomainEvent event);

    InternalCommand MapToInternalCommand(DomainEvent event);
}