package com.github.dimitryivaniuta.audittrail.service;

import com.github.dimitryivaniuta.audittrail.domain.AuditRecordEntity;
import com.github.dimitryivaniuta.audittrail.domain.AuditChainHeadEntity;
import com.github.dimitryivaniuta.audittrail.hash.AuditHashingService;
import com.github.dimitryivaniuta.audittrail.hash.CanonicalJsonService;
import com.github.dimitryivaniuta.audittrail.repo.AuditRecordRepository;
import com.github.dimitryivaniuta.audittrail.repo.AuditChainHeadRepository;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Core audit record operations.
 *
 * <p>Write path is append-only and serializes per-tenant chain using a pessimistic lock on
 * the last record query.</p>
 */
@Service
public class AuditRecordService {

    private final AuditRecordRepository repository;
    private final AuditChainHeadRepository chainHeadRepository;
    private final CanonicalJsonService canonicalJsonService;
    private final AuditHashingService hashingService;
    private final AuditEventPublisher eventPublisher;

    /**
     * Creates the service.
     *
     * @param repository repository
     * @param canonicalJsonService canonical JSON service
     * @param hashingService hashing service
     * @param eventPublisher optional event publisher
     */
    public AuditRecordService(
            AuditRecordRepository repository,
            AuditChainHeadRepository chainHeadRepository,
            CanonicalJsonService canonicalJsonService,
            AuditHashingService hashingService,
            AuditEventPublisher eventPublisher) {
        this.repository = repository;
        this.chainHeadRepository = chainHeadRepository;
        this.canonicalJsonService = canonicalJsonService;
        this.hashingService = hashingService;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Appends an audit record in a tamper-evident chain.
     *
     * <p>If {@code eventId} is provided and already exists for the same tenant, the existing record
     * is returned (idempotent append).</p>
     *
     * @param req append request
     * @return persisted entity
     */
    @Transactional
    public AuditRecordEntity append(AppendAuditRecordRequest req) {
        UUID eventId = req.eventId() != null ? req.eventId() : UUID.randomUUID();
        Optional<AuditRecordEntity> existing = repository.findByTenantIdAndEventId(req.tenantId(), eventId);
        if (existing.isPresent()) {
            return existing.get();
        }

        AuditChainHeadEntity head = chainHeadRepository.findForUpdate(req.tenantId()).orElseGet(() -> {
            // First record for this tenant: create a chain head row, then lock it.
            AuditChainHeadEntity created = new AuditChainHeadEntity();
            created.setTenantId(req.tenantId());
            created.setLastSeq(0L);
            created.setLastHash(null);
            created.setLastRecordId(null);
            created.setUpdatedAt(Instant.now());
            try {
                chainHeadRepository.saveAndFlush(created);
            } catch (Exception ignore) {
                // concurrent insert - ignore and reload with lock below
            }
            return chainHeadRepository.findForUpdate(req.tenantId())
                    .orElseThrow(() -> new IllegalStateException("Failed to initialize chain head for tenant: " + req.tenantId()));
        });

        // Canonicalize JSON for stable hash computation.
        String dataJson = canonicalJsonService.canonicalize(req.data());

        Instant now = Instant.now();
        long nextSeq = head.getLastSeq() + 1;
        String prevHash = head.getLastHash();

        AuditRecordEntity entity = new AuditRecordEntity();
        entity.setTenantId(req.tenantId());
        entity.setSeq(nextSeq);
        entity.setEventId(eventId);
        entity.setActor(req.actor());
        entity.setAction(req.action());
        entity.setResourceType(req.resourceType());
        entity.setResourceId(req.resourceId());
        entity.setCorrelationId(req.correlationId());
        entity.setDataJson(dataJson);
        entity.setHashAlg(AuditHashingService.HASH_ALG);
        entity.setKeyId(hashingService.activeKeyId());
        entity.setPrevHash(prevHash);
        entity.setCreatedAt(now);

        entity.setHash(hashingService.computeHashHex(entity.getKeyId(),
                new AuditHashingService.AuditHashPayload(
                        entity.getTenantId(),
                        entity.getEventId().toString(),
                        entity.getActor(),
                        entity.getAction(),
                        entity.getResourceType(),
                        entity.getResourceId(),
                        entity.getCorrelationId(),
                        entity.getCreatedAt(),
                        entity.getPrevHash(),
                        entity.getDataJson()
                )));

        try {
            AuditRecordEntity saved = repository.saveAndFlush(entity);
            head.setLastSeq(saved.getSeq());
            head.setLastHash(saved.getHash());
            head.setLastRecordId(saved.getId());
            head.setUpdatedAt(Instant.now());
            chainHeadRepository.saveAndFlush(head);

            eventPublisher.publishAppended(saved);
            return saved;
        } catch (DataIntegrityViolationException e) {
            // Race on eventId uniqueness (idempotency). Return existing.
            return repository.findByTenantIdAndEventId(req.tenantId(), eventId)
                    .orElseThrow(() -> e);
        }
    }

    /**
     * Gets a record by id (cached).
     *
     * @param id id
     * @return entity
     */
    @Cacheable(cacheNames = "audit-record", key = "#id")
    public AuditRecordEntity getById(long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Audit record not found: id=" + id));
    }

    /**
     * Searches records for a tenant with optional filters.
     *
     * @param tenantId tenant
     * @param actor actor filter
     * @param action action filter
     * @param fromTs from timestamp (inclusive)
     * @param toTs to timestamp (exclusive)
     * @param pageable pageable
     * @return page
     */
    public Page<AuditRecordEntity> search(String tenantId, String actor, String action, Instant fromTs, Instant toTs, Pageable pageable) {
        return repository.search(tenantId, actor, action, fromTs, toTs, pageable);
    }

    /**
     * Verifies integrity of the hash chain for a tenant.
     *
     * @param tenantId tenant
     * @param fromId optional from id inclusive
     * @param toId optional to id inclusive
     * @return result
     */
    public VerificationResult verify(String tenantId, Long fromId, Long toId) {
        List<AuditRecordEntity> records = repository.loadRange(tenantId, fromId, toId);

        String previousHash = null;
        Long previousId = null;

        for (AuditRecordEntity record : records) {
            // Verify that stored prevHash matches previous record hash.
            if (previousId == null) {
                if (record.getPrevHash() != null) {
                    return VerificationResult.mismatch(record.getId(), "Genesis record has non-null prevHash");
                }
            } else {
                if (record.getPrevHash() == null || !record.getPrevHash().equals(previousHash)) {
                    return VerificationResult.mismatch(record.getId(), "prevHash mismatch: expected hash of id=" + previousId);
                }
            }

            // Verify record hash itself.
            String recomputed = hashingService.recomputeHashHex(record);
            if (!recomputed.equals(record.getHash())) {
                return VerificationResult.mismatch(record.getId(), "hash mismatch: recomputed differs from stored hash");
            }

            previousHash = record.getHash();
            previousId = record.getId();
        }

        return VerificationResult.ok(records.size());
    }


    /**
     * Loads a range of records ordered by id (for export/verification).
     *
     * @param tenantId tenant
     * @param fromId start id inclusive
     * @param toId end id inclusive
     * @return records
     */
    public List<AuditRecordEntity> loadRange(String tenantId, Long fromId, Long toId) {
        return repository.loadRange(tenantId, fromId, toId);
    }

    /**
     * Canonicalizes arbitrary JSON-like data into a stable JSON string.
     *
     * @param data map
     * @return canonical JSON
     */
    /**
     * Append request.
     *
     * @param tenantId tenant
     * @param eventId idempotency id (optional)
     * @param actor actor
     * @param action action
     * @param resourceType resource type
     * @param resourceId resource id
     * @param correlationId correlation id (optional)
     * @param data details
     */
    public record AppendAuditRecordRequest(
            String tenantId,
            UUID eventId,
            String actor,
            String action,
            String resourceType,
            String resourceId,
            String correlationId,
            Map<String, Object> data
    ) {
    }
}
