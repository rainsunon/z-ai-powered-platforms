package com.github.dimitryivaniuta.audittrail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Secure Audit Trail Service.
 *
 * <p>This service provides an append-only, tamper-evident audit log backed by PostgreSQL.
 * Each audit record stores a cryptographic HMAC hash that chains to the previous record,
 * so any modification is detectable via verification endpoints.</p>
 */
@SpringBootApplication
public class SecureAuditTrailServiceApplication {

    /**
     * Boots the Spring application.
     *
     * @param args application args
     */
    public static void main(String[] args) {
        SpringApplication.run(SecureAuditTrailServiceApplication.class, args);
    }
}
