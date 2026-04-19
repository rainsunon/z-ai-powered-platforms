package com.xrs.buildingblocks.jpa;


import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

/**
 * @author Rui S.
 * @date 2026-02-03
 * @apiNote
 */
public class JpaAuditorAwareImpl implements AuditorAware<Long> {
    @Override
    public @NonNull Optional<Long> getCurrentAuditor() {
        // Fetch the current user ID from the security context or other sources
        return Optional.of(1L); // Replace with actual logic
    }
}