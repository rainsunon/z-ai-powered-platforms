package com.github.dimitryivaniuta.multitenant.security;

import com.github.dimitryivaniuta.multitenant.util.IntegrationTestBase;
import com.github.dimitryivaniuta.multitenant.util.JwtTestTokenFactory;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Proves JWKS rotation support: the resource server accepts JWTs signed with any active {@code kid}
 * present in {@code /.well-known/jwks.json}.
 */
public class JwksRotationIT extends IntegrationTestBase {

  private static final String ISSUER = "https://auth.local";
  private static final String AUD = "api";

  @Autowired
  TestRestTemplate rest;

  @Test
  void acceptsTokensSignedByOldAndNewKeys() {
    UUID tenantId = UUID.randomUUID();

    String tokenK1 = JwtTestTokenFactory.createToken("k1", "keys/jwks-k1-private.pem.example", ISSUER, AUD, tenantId);
    String tokenK2 = JwtTestTokenFactory.createToken("k2", "keys/jwks-k2-private.pem.example", ISSUER, AUD, tenantId);

    assertThat(callHealth(tokenK1).getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(callHealth(tokenK2).getStatusCode()).isEqualTo(HttpStatus.OK);
  }

  private ResponseEntity<String> callHealth(String token) {
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(token);
    return rest.exchange(
        "/api/users",
        HttpMethod.GET,
        new HttpEntity<>(headers),
        String.class
    );
  }
}
