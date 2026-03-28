package com.github.dimitryivaniuta.gateway.outbox;

import com.github.dimitryivaniuta.gateway.outbox.model.OutboxMessage;
import com.github.dimitryivaniuta.gateway.outbox.model.OutboxStatus;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Clock;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * JDBC-based outbox repository.
 *
 * <p>Uses PostgreSQL {@code FOR UPDATE SKIP LOCKED} to safely claim rows in a multi-instance cluster.</p>
 */
@Repository
@RequiredArgsConstructor
public class OutboxRepository {

    private final JdbcTemplate jdbcTemplate;
    private final Clock clock;

    private static final RowMapper<OutboxMessage> OUTBOX_MAPPER = new OutboxRowMapper();

    /**
     * Claims up to {@code limit} outbox rows for publishing.
     *
     * <p>This method is cluster-safe: multiple instances can call it concurrently without double-claiming the same rows.</p>
     *
     * @param limit maximum number of rows to claim
     * @param instanceId publisher instance id (lock owner)
     * @param lockTtl how long the claim is valid
     * @return claimed rows
     */
    @Transactional
    public List<OutboxMessage> claimBatch(int limit, String instanceId, Duration lockTtl) {
        long lockSeconds = Math.max(1, lockTtl.getSeconds());

        return jdbcTemplate.query("""
                WITH candidate AS (
                    SELECT id
                    FROM outbox_messages
                    WHERE status IN ('PENDING', 'RETRY')
                      AND available_at <= now()
                    ORDER BY created_at
                    FOR UPDATE SKIP LOCKED
                    LIMIT ?
                ),
                claimed AS (
                    UPDATE outbox_messages m
                    SET status = 'LOCKED',
                        locked_by = ?,
                        locked_at = now(),
                        lock_until = now() + (? * INTERVAL '1 second')
                    WHERE m.id IN (SELECT id FROM candidate)
                    RETURNING m.id, m.event_type, m.aggregate_id, m.payload::text AS payload_json, m.status,
                              m.created_at, m.available_at, m.attempts, m.locked_by, m.locked_at, m.lock_until
                )
                SELECT * FROM claimed
                """,
                OUTBOX_MAPPER,
                limit,
                instanceId,
                lockSeconds
        );
    }

    /**
     * Marks an outbox message as SENT.
     *
     * @param id outbox message id
     * @param instanceId lock owner (must match)
     * @return number of updated rows (0 if lost lock)
     */
    @Transactional
    public int markSent(UUID id, String instanceId) {
        return jdbcTemplate.update("""
                UPDATE outbox_messages
                SET status = 'SENT',
                    sent_at = now(),
                    locked_by = NULL,
                    locked_at = NULL,
                    lock_until = NULL,
                    last_error = NULL
                WHERE id = ?
                  AND status = 'LOCKED'
                  AND locked_by = ?
                """,
                id,
                instanceId
        );
    }

    /**
     * Marks an outbox message as RETRY or DEAD (based on attempts).
     *
     * @param id outbox message id
     * @param instanceId lock owner (must match)
     * @param maxAttempts max attempts before DEAD
     * @param nextAvailableAt next publish time
     * @param lastError error to store
     * @return updated rows
     */
    @Transactional
    public int markFailed(UUID id, String instanceId, int maxAttempts, OffsetDateTime nextAvailableAt, String lastError) {
        return jdbcTemplate.update("""
                UPDATE outbox_messages
                SET attempts = attempts + 1,
                    status = CASE WHEN (attempts + 1) >= ? THEN 'DEAD' ELSE 'RETRY' END,
                    available_at = ?,
                    locked_by = NULL,
                    locked_at = NULL,
                    lock_until = NULL,
                    last_error = ?
                WHERE id = ?
                  AND status = 'LOCKED'
                  AND locked_by = ?
                """,
                maxAttempts,
                nextAvailableAt,
                lastError,
                id,
                instanceId
        );
    }

    /**
     * Unlocks stale LOCKED rows that exceeded {@code lock_until}.
     *
     * <p>Useful when an instance crashes while holding locks.</p>
     *
     * @return number of unlocked rows
     */
    @Transactional
    public int unlockStaleLocks() {
        return jdbcTemplate.update("""
                UPDATE outbox_messages
                SET status = 'RETRY',
                    available_at = now(),
                    locked_by = NULL,
                    locked_at = NULL,
                    lock_until = NULL
                WHERE status = 'LOCKED'
                  AND lock_until < now()
                """);
    }

    /**
     * Reads \"stuck\" outbox rows for diagnostics.
     *
     * @param olderThan consider PENDING/RETRY rows older than this duration as stuck
     * @return stuck rows
     */
    @Transactional(readOnly = true)
    public List<OutboxStuckRow> findStuck(Duration olderThan) {
        OffsetDateTime now = OffsetDateTime.now(clock);
        OffsetDateTime threshold = now.minus(olderThan);

        return jdbcTemplate.query("""
                SELECT id, event_type, aggregate_id, status, created_at, available_at, attempts,
                       locked_by, locked_at, lock_until, last_error
                FROM outbox_messages
                WHERE (status IN ('PENDING', 'RETRY') AND created_at < ?)
                   OR (status = 'LOCKED' AND lock_until < now())
                   OR (status = 'DEAD' AND created_at < ?)
                ORDER BY created_at ASC
                LIMIT 500
                """,
                (rs, rowNum) -> mapStuck(rs),
                threshold,
                threshold
        );
    }

    private OutboxStuckRow mapStuck(ResultSet rs) throws SQLException {
        return new OutboxStuckRow(
                (UUID) rs.getObject("id"),
                rs.getString("event_type"),
                rs.getString("aggregate_id"),
                OutboxStatus.valueOf(rs.getString("status")),
                rs.getObject("created_at", OffsetDateTime.class),
                rs.getObject("available_at", OffsetDateTime.class),
                rs.getInt("attempts"),
                rs.getString("locked_by"),
                rs.getObject("locked_at", OffsetDateTime.class),
                rs.getObject("lock_until", OffsetDateTime.class),
                rs.getString("last_error")
        );
    }

    private static final class OutboxRowMapper implements RowMapper<OutboxMessage> {
        @Override
        public OutboxMessage mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new OutboxMessage(
                    (UUID) rs.getObject("id"),
                    rs.getString("event_type"),
                    rs.getString("aggregate_id"),
                    rs.getString("payload_json"),
                    OutboxStatus.valueOf(rs.getString("status")),
                    rs.getObject("created_at", OffsetDateTime.class),
                    rs.getObject("available_at", OffsetDateTime.class),
                    rs.getInt("attempts"),
                    rs.getString("locked_by"),
                    rs.getObject("locked_at", OffsetDateTime.class),
                    rs.getObject("lock_until", OffsetDateTime.class)
            );
        }
    }
}
