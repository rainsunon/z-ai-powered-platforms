package com.github.dimitryivaniuta.audittrail.repo;

import com.github.dimitryivaniuta.audittrail.domain.AuditRecordEntity;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repository for audit records.
 */
public interface AuditRecordRepository extends JpaRepository<AuditRecordEntity, Long> {

    /**
     * Finds the last record for a tenant with a pessimistic lock to serialize appends per tenant.
     *
     * @param tenantId tenant id
     * @return optional last record
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<AuditRecordEntity> findTopByTenantIdOrderByIdDesc(String tenantId);

    /**
     * Loads a record by tenant + event id (idempotency key).
     *
     * @param tenantId tenant id
     * @param eventId event id
     * @return optional record
     */
    Optional<AuditRecordEntity> findByTenantIdAndEventId(String tenantId, UUID eventId);

    /**
     * Searches records by filters. All filters are optional; if null, they are ignored.
     *
     * @param tenantId tenant id
     * @param actor actor filter
     * @param action action filter
     * @param fromTs from timestamp (inclusive)
     * @param toTs to timestamp (exclusive)
     * @param pageable page request
     * @return page
     */
    @Query("""
        select r from AuditRecordEntity r
        where r.tenantId = :tenantId
          and (:actor is null or lower(r.actor) like lower(concat('%', :actor, '%')))
          and (:action is null or r.action = :action)
          and (:fromTs is null or r.createdAt >= :fromTs)
          and (:toTs is null or r.createdAt < :toTs)
        order by r.seq asc, r.id asc
        """)
    Page<AuditRecordEntity> search(
            @Param("tenantId") String tenantId,
            @Param("actor") String actor,
            @Param("action") String action,
            @Param("fromTs") Instant fromTs,
            @Param("toTs") Instant toTs,
            Pageable pageable);

    /**
     * Loads records for verification/export in id order.
     *
     * @param tenantId tenant
     * @param fromId start id inclusive (nullable)
     * @param toId end id inclusive (nullable)
     * @return list
     */
    @Query("""
        select r from AuditRecordEntity r
        where r.tenantId = :tenantId
          and (:fromId is null or r.id >= :fromId)
          and (:toId is null or r.id <= :toId)
        order by r.seq asc, r.id asc
        """)
    List<AuditRecordEntity> loadRange(
            @Param("tenantId") String tenantId,
            @Param("fromId") Long fromId,
            @Param("toId") Long toId);
}
