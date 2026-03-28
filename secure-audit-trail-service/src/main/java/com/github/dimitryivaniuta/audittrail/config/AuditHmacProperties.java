package com.github.dimitryivaniuta.audittrail.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.HashMap;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * HMAC configuration used to compute tamper-evident hashes for audit records.
 *
 * <p>In production, secrets should be stored in a secret manager (AWS KMS / Azure Key Vault / GCP KMS),
 * and injected via environment variables.</p>
 */
@Validated
@ConfigurationProperties(prefix = "audit.hmac")
public class AuditHmacProperties {

    /**
     * Active key identifier. New records are signed with this key id.
     */
    @NotBlank
    private String activeKeyId = "key1";

    /**
     * Map of keyId -> secret (UTF-8 string).
     *
     * <p>For production you may prefer a base64-encoded secret; keeping it plain here for readability.</p>
     */
    @NotEmpty
    private Map<String, String> keys = new HashMap<>();

    public String getActiveKeyId() {
        return activeKeyId;
    }

    public void setActiveKeyId(String activeKeyId) {
        this.activeKeyId = activeKeyId;
    }

    public Map<String, String> getKeys() {
        return keys;
    }

    public void setKeys(Map<String, String> keys) {
        this.keys = keys;
    }
}
