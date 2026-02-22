package com.xrs.multitenant.repo;

import com.xrs.multitenant.domain.UserEntity;
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
