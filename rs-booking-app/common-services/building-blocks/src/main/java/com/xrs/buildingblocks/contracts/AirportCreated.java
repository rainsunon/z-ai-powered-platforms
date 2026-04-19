package com.xrs.buildingblocks.contracts;


import com.xrs.buildingblocks.core.event.IntegrationEvent;

import java.util.UUID;

/**
 * @author Rui S.
 * @date 2026-02-06
 * @apiNote
 */

public record AirportCreated(UUID Id) implements IntegrationEvent {
}