package com.github.dimitryivaniuta.multitenant.security.jwks;

import com.nimbusds.jose.jwk.JWKSet;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * JWKS endpoint.
 *
 * <p>Public keys are exposed at {@code /.well-known/jwks.json}. This is safe to be unauthenticated.
 */
@RestController
public class JwksController {

  private final JwksKeyRing keyRing;

  public JwksController(JwksKeyRing keyRing) {
    this.keyRing = keyRing;
  }

  /**
   * Returns a JSON Web Key Set containing all active public keys.
   *
   * @return JWKS JSON object
   */
  @GetMapping(value = "/.well-known/jwks.json", produces = MediaType.APPLICATION_JSON_VALUE)
  public Map<String, Object> jwks() {
    JWKSet set = keyRing.publicJwkSet();
    return set.toJSONObject();
  }
}
