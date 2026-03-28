package com.github.dimitryivaniuta.multitenant.security.jwks;

import com.github.dimitryivaniuta.multitenant.security.JwtProperties;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import java.security.interfaces.RSAPublicKey;
import java.util.ArrayList;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

/**
 * In-memory JWKS key ring.
 *
 * <p>This component loads configured RSA public keys and exposes them as:
 * <ul>
 *   <li>a {@link JWKSet} for the JWKS endpoint</li>
 *   <li>a list of {@link RSAKey} objects for building a {@code JwtDecoder}</li>
 * </ul>
 *
 * <p>Rotation model: keep multiple active keys in the set. Tokens signed with old keys keep working
 * until they expire, while new tokens can use a new {@code kid}.
 */
@Component
public class JwksKeyRing {

  private final JWKSet publicJwkSet;

  public JwksKeyRing(JwtProperties props, ResourceLoader resourceLoader) {
    List<RSAKey> keys = new ArrayList<>();

    if (props.jwks() == null || props.jwks().keys() == null || props.jwks().keys().isEmpty()) {
      throw new IllegalStateException("No JWKS keys configured (app.security.jwt.jwks.keys)");
    }

    for (JwtProperties.Jwks.Key k : props.jwks().keys()) {
      Resource res = resourceLoader.getResource(k.publicKeyLocation());
      RSAPublicKey pub = PemKeyUtils.loadRsaPublicKey(res);

      RSAKey rsaKey = new RSAKey.Builder(pub)
          .keyID(k.kid())
          .build();

      keys.add(rsaKey);
    }

    this.publicJwkSet = new JWKSet(keys);
  }

  /**
   * Returns the public JWKS (no private key material).
   */
  public JWKSet publicJwkSet() {
    return publicJwkSet;
  }
}
