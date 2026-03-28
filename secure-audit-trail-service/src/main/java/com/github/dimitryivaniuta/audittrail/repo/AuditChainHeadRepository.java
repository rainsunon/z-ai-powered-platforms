package com.github.dimitryivaniuta.audittrail.repo;

import com.github.dimitryivaniuta.audittrail.domain.AuditChainHeadEntity;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repository for per-tenant chain heads.
 */
public interface AuditChainHeadRepository extends JpaRepository<AuditChainHeadEntity, String> {

    /**
     * Loads a tenant chain head using a pessimistic lock to serialize append operations.
     *
     * @param tenantId tenant id
     * @return optional head
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select h from AuditChainHeadEntity h where h.tenantId = :tenantId")
    Optional<AuditChainHeadEntity> findForUpdate(@Param("tenantId") String tenantId);
}
