package com.github.dimitryivaniuta.multitenant.security;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * JWT validation settings.
 *
 * <p>The API is a resource server. JWTs are validated using a local JWKS key set (asymmetric keys) to
 * support key rotation without downtime.
 */
@ConfigurationProperties(prefix = "app.security.jwt")
public record JwtProperties(
    String issuer,
    String audience,
    Jwks jwks
) {

  /**
   * JWKS configuration (public keys used for validation + exposed via {@code /.well-known/jwks.json}).
   */
  public record Jwks(
      List<Key> keys
  ) {

    /**
     * Single JWK key entry.
     *
     * @param kid key id that must match JWT header {@code kid}
     * @param publicKeyLocation classpath location of an RSA public key PEM (X.509 SubjectPublicKeyInfo)
     */
    public record Key(
        String kid,
        String publicKeyLocation
    ) {
    }
  }
}
