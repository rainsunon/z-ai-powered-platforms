package com.github.dimitryivaniuta.audittrail.hash;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dimitryivaniuta.audittrail.config.AuditHmacProperties;
import com.github.dimitryivaniuta.audittrail.domain.AuditRecordEntity;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Component;

/**
 * Computes and verifies the HMAC hash for audit records.
 *
 * <p>Important security note: a plain hash chain (SHA-256 over fields) detects accidental corruption,
 * but a privileged attacker could rewrite history and recompute hashes. Using an HMAC binds the chain
 * to a secret key stored outside the database, making forged recomputation significantly harder.</p>
 */
@Component
public class AuditHashingService {

    /**
     * Hash algorithm stored with each record.
     */
    public static final String HASH_ALG = "HmacSHA256";

    private final ObjectMapper objectMapper;
    private final AuditHmacProperties hmacProperties;

    /**
     * Creates the service.
     *
     * @param objectMapper deterministic object mapper
     * @param hmacProperties HMAC properties
     */
    public AuditHashingService(ObjectMapper objectMapper, AuditHmacProperties hmacProperties) {
        this.objectMapper = objectMapper;
        this.hmacProperties = hmacProperties;
    }

    /**
     * Returns the active key id for new records.
     *
     * @return active key id
     */
    public String activeKeyId() {
        return hmacProperties.getActiveKeyId();
    }

    /**
     * Computes record hash (hex) for the given payload and key id.
     *
     * @param keyId key id
     * @param payload payload
     * @return hex hash
     */
    public String computeHashHex(String keyId, AuditHashPayload payload) {
        byte[] data = payload.toCanonicalString(objectMapper).getBytes(StandardCharsets.UTF_8);
        byte[] mac = hmac(keyId, data);
        return HexFormat.of().formatHex(mac);
    }

    /**
     * Recomputes the record hash for an existing entity (using its stored key id).
     *
     * @param entity record entity
     * @return recomputed hash hex
     */
    public String recomputeHashHex(AuditRecordEntity entity) {
        AuditHashPayload payload = AuditHashPayload.fromEntity(entity);
        return computeHashHex(entity.getKeyId(), payload);
    }

    /**
     * Computes HMAC bytes with the key referenced by {@code keyId}.
     *
     * @param keyId key id
     * @param data message bytes
     * @return mac bytes
     */
    private byte[] hmac(String keyId, byte[] data) {
        String secret = hmacProperties.getKeys().get(keyId);
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("Missing HMAC secret for keyId=" + keyId);
        }
        try {
            Mac mac = Mac.getInstance(HASH_ALG);
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HASH_ALG));
            return mac.doFinal(data);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("JCE does not support " + HASH_ALG, e);
        } catch (InvalidKeyException e) {
            throw new IllegalStateException("Invalid HMAC key", e);
        }
    }

    /**
     * Deterministic hashing payload.
     *
     * <p>We avoid depending on DB-assigned id for the hash (id is generated after insert),
     * so the hash is computed over stable business fields + createdAt + prevHash.</p>
     *
     * @param tenantId tenant
     * @param eventId event id
     * @param actor actor
     * @param action action
     * @param resourceType resource type
     * @param resourceId resource id
     * @param correlationId correlation id
     * @param createdAt created at (service time)
     * @param prevHash previous hash
     * @param dataJson data JSON (already canonicalized)
     */
    public record AuditHashPayload(
            String tenantId,
            String eventId,
            String actor,
            String action,
            String resourceType,
            String resourceId,
            String correlationId,
            Instant createdAt,
            String prevHash,
            String dataJson
    ) {

        /**
         * Creates payload from entity.
         *
         * @param e entity
         * @return payload
         */
        public static AuditHashPayload fromEntity(AuditRecordEntity e) {
            return new AuditHashPayload(
                    e.getTenantId(),
                    e.getEventId().toString(),
                    e.getActor(),
                    e.getAction(),
                    e.getResourceType(),
                    e.getResourceId(),
                    e.getCorrelationId(),
                    e.getCreatedAt(),
                    e.getPrevHash(),
                    e.getDataJson()
            );
        }

        /**
         * Serializes the payload to a canonical JSON string.
         *
         * @param objectMapper mapper
         * @return canonical string
         */
        public String toCanonicalString(ObjectMapper objectMapper) {
            try {
                // Use JSON for canonicalization; properties and map entries are sorted in the configured mapper.
                return objectMapper.writeValueAsString(this);
            } catch (Exception e) {
                throw new IllegalStateException("Failed to serialize hash payload", e);
            }
        }
    }
}
