package com.xrs.booking.auth.repo;

import com.xrs.booking.auth.domain.EmailVerificationToken;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** Repository for email verification tokens. */
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {

  Optional<EmailVerificationToken> findByTokenHash(String tokenHash);
}
