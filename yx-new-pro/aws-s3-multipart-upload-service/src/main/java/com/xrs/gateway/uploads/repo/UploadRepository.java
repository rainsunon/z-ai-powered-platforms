package com.xrs.gateway.uploads.repo;

import com.xrs.gateway.uploads.domain.UploadEntity;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JPA repository for upload sessions.
 */
public interface UploadRepository extends JpaRepository<UploadEntity, UUID> {

  List<UploadEntity> findTop50ByUserSubOrderByCreatedAtDesc(String userSub);

  Optional<UploadEntity> findByUserSubAndIdempotencyKey(String userSub, String idempotencyKey);

  List<UploadEntity> findTop200ByStatusAndCreatedAtBeforeOrderByCreatedAtAsc(String status, OffsetDateTime cutoff);
}
