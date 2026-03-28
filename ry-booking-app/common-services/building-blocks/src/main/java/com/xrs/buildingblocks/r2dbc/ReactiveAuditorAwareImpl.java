package com.xrs.buildingblocks.r2dbc;


import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.ReactiveAuditorAware;
import reactor.core.publisher.Mono;

/**
 * @author Rui S.
 * @date 2026-02-03
 * @apiNote
 */
public class ReactiveAuditorAwareImpl implements ReactiveAuditorAware<Long> {

    @Override
    public @NonNull Mono<Long> getCurrentAuditor() {
        // Replace this with your logic to fetch the current user ID
        // For example, fetching it from a reactive security context
        return Mono.justOrEmpty(getCurrentUserId());
    }

    private Long getCurrentUserId() {
        // Implement your logic to fetch the current user ID
        return 1L; // Example: Return a fixed user ID
    }
}