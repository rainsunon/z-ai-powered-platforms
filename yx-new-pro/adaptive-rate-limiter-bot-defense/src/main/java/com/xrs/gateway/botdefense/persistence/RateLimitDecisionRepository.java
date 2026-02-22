package com.xrs.gateway.botdefense.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Repository for decision records.
 */
public interface RateLimitDecisionRepository extends JpaRepository<RateLimitDecisionEntity, UUID> {
}
