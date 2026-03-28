package com.github.dimitryivaniuta.multitenant.repo;

import com.github.dimitryivaniuta.multitenant.domain.UserEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * User repository.
 *
 * <p>Note: methods here do not explicitly filter by tenant. PostgreSQL RLS enforces
 * tenant isolation for all queries.
 */
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
}
