package com.xrs.gateway.botdefense.api;

import com.xrs.gateway.botdefense.persistence.RateLimitDecisionEntity;
import com.xrs.gateway.botdefense.persistence.RateLimitDecisionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

/**
 * Minimal read API to inspect rate limiting denials.
 */
@RestController
@RequestMapping("/api/admin")
public class AuditController {

    private final RateLimitDecisionRepository repo;

    public AuditController(RateLimitDecisionRepository repo) {
        this.repo = repo;
    }

    /**
     * Lists most recent denials.
     */
    @GetMapping("/rate-limit-denials")
    public Page<RateLimitDecisionEntity> list(Pageable pageable) {
        return repo.findAll(pageable);
    }
}
