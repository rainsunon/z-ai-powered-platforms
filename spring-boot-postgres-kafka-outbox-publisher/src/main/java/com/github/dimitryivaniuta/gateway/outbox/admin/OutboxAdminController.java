package com.github.dimitryivaniuta.gateway.outbox.admin;

import com.github.dimitryivaniuta.gateway.outbox.OutboxRepository;
import com.github.dimitryivaniuta.gateway.outbox.OutboxStuckRow;
import com.github.dimitryivaniuta.gateway.outbox.config.OutboxPublisherProperties;
import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Admin endpoints for outbox diagnostics.
 */
@RestController
@RequestMapping("/api/admin/outbox")
@RequiredArgsConstructor
public class OutboxAdminController {

    private final OutboxRepository outboxRepository;
    private final OutboxPublisherProperties properties;

    /**
     * Lists \"stuck\" outbox rows.
     *
     * <p>Stuck rows are:
     * <ul>
     *   <li>PENDING/RETRY older than {@code olderThan}</li>
     *   <li>LOCKED with expired {@code lock_until}</li>
     *   <li>DEAD older than {@code olderThan}</li>
     * </ul>
     * </p>
     *
     * @param olderThan optional override, ISO-8601 duration (e.g. PT5M)
     * @return stuck rows (max 500)
     */
    @GetMapping("/stuck")
    public List<OutboxStuckRow> stuck(@RequestParam(required = false) Duration olderThan) {
        Duration d = olderThan != null ? olderThan : properties.getStuckOlderThan();
        return outboxRepository.findStuck(d);
    }
}
