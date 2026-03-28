package com.github.dimitryivaniuta.multitenant.api;

import com.github.dimitryivaniuta.multitenant.api.dto.CreateUserRequest;
import com.github.dimitryivaniuta.multitenant.util.IntegrationTestBase;
import com.github.dimitryivaniuta.multitenant.util.JwtTestTokenFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Ensures requests without a tenant id claim are rejected.
 */
public class MissingTenantClaimIT extends IntegrationTestBase {

  private static final String KID = "k1";
  private static final String PRIVATE_KEY = "keys/jwks-k1-private.pem.example";
  private static final String ISSUER = "https://auth.local";
  private static final String AUD = "api";

  @Autowired
  TestRestTemplate rest;

  @Test
  void missingTenantClaim_returns400ProblemDetail() {
    String jwt = JwtTestTokenFactory.createTokenWithoutTenant(SECRET, ISSUER, AUD);

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(jwt);
    headers.setContentType(MediaType.APPLICATION_JSON);

    ResponseEntity<String> res = rest.exchange(
        "/api/users",
        HttpMethod.POST,
        new HttpEntity<>(new CreateUserRequest("x@example.com", "X"), headers),
        String.class
    );

    assertThat(res.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(res.getBody()).contains("tenant").contains("tenantId");
    assertThat(res.getHeaders().getFirst("X-Correlation-Id")).isNotBlank();
    assertThat(res.getBody()).contains("correlationId");
  }
}
