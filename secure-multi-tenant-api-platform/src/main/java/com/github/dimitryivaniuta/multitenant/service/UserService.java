package com.github.dimitryivaniuta.multitenant.service;

import com.github.dimitryivaniuta.multitenant.api.dto.CreateUserRequest;
import com.github.dimitryivaniuta.multitenant.api.dto.UserResponse;
import com.github.dimitryivaniuta.multitenant.domain.UserEntity;
import com.github.dimitryivaniuta.multitenant.kafka.UserEventsProducer;
import com.github.dimitryivaniuta.multitenant.repo.UserRepository;
import com.github.dimitryivaniuta.multitenant.tenant.TenantContext;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User operations, scoped to the current tenant.
 */
@Service
public class UserService {

  private final UserRepository userRepository;
  private final UserEventsProducer eventsProducer;

  public UserService(UserRepository userRepository, UserEventsProducer eventsProducer) {
    this.userRepository = userRepository;
    this.eventsProducer = eventsProducer;
  }

  /**
   * Creates a user in the current tenant.
   */
  @Transactional
  public UserResponse create(CreateUserRequest req) {
    UUID tenantId = TenantContext.requireTenantId();
    UUID id = UUID.randomUUID();

    UserEntity entity = UserEntity.builder()
        .id(id)
        .tenantId(tenantId)
        .email(req.email())
        .fullName(req.fullName())
        .createdAt(Instant.now())
        .build();

    userRepository.save(entity);

    eventsProducer.userCreated(entity);
    return toResponse(entity);
  }

  /**
   * Returns a user by id for the current tenant.
   *
   * <p>Cross-tenant access returns empty because PostgreSQL RLS filters the row.
   */
  @Transactional(readOnly = true)
  @Cacheable(cacheNames = "users", key = "'tenant:' + T(com.github.dimitryivaniuta.multitenant.tenant.TenantContext).requireTenantId() + ':user:' + #id")
  public UserResponse get(UUID id) {
    return userRepository.findById(id)
        .map(this::toResponse)
        .orElseThrow(() -> new UserNotFoundException("User not found"));
  }

  /**
   * Lists all users for the current tenant.
   */
  @Transactional(readOnly = true)
  public List<UserResponse> list() {
    return userRepository.findAll().stream().map(this::toResponse).toList();
  }

  /**
   * Deletes a user (tenant-scoped).
   */
  @Transactional
  @CacheEvict(cacheNames = "users", key = "'tenant:' + T(com.github.dimitryivaniuta.multitenant.tenant.TenantContext).requireTenantId() + ':user:' + #id")
  public void delete(UUID id) {
    if (!userRepository.existsById(id)) {
      throw new UserNotFoundException("User not found");
    }
    userRepository.deleteById(id);
  }

  private UserResponse toResponse(UserEntity e) {
    return new UserResponse(e.getId(), e.getTenantId(), e.getEmail(), e.getFullName(), e.getCreatedAt());
  }
}
