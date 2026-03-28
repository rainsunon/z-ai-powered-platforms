package com.github.dimitryivaniuta.multitenant.api;

import com.github.dimitryivaniuta.multitenant.api.dto.CreateUserRequest;
import com.github.dimitryivaniuta.multitenant.api.dto.UserResponse;
import com.github.dimitryivaniuta.multitenant.util.IntegrationTestBase;
import com.github.dimitryivaniuta.multitenant.util.JwtTestTokenFactory;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Proves tenant isolation end-to-end.
 */
public class TenantIsolationIT extends IntegrationTestBase {

  private static final String KID = "k1";
  private static final String PRIVATE_KEY = "keys/jwks-k1-private.pem.example";
  private static final String ISSUER = "https://auth.local";
  private static final String AUD = "api";

  @Autowired
  TestRestTemplate rest;

  @Autowired
  RedisConnectionFactory redis;

  @Test
  void cannotReadAcrossTenants_andCacheIsTenantScoped() {
    UUID tenantA = UUID.randomUUID();
    UUID tenantB = UUID.randomUUID();

    String tokenA = JwtTestTokenFactory.createToken(KID, PRIVATE_KEY, ISSUER, AUD, tenantA);
    String tokenB = JwtTestTokenFactory.createToken(KID, PRIVATE_KEY, ISSUER, AUD, tenantB);

    // Create user as tenant A
    UserResponse created = postUser(tokenA, new CreateUserRequest("a@example.com", "Alice"));
    assertThat(created.tenantId()).isEqualTo(tenantA);

    // Tenant A can read
    UserResponse readA = getUser(tokenA, created.id(), HttpStatus.OK).getBody();
    assertThat(readA).isNotNull();
    assertThat(readA.id()).isEqualTo(created.id());

    // Tenant B cannot read tenant A user (RLS => behaves like 404)
    ResponseEntity<String> readB = getUserRaw(tokenB, created.id());
    assertThat(readB.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

    // List isolation
    ResponseEntity<java.util.List<UserResponse>> listA = listUsers(tokenA);
    ResponseEntity<java.util.List<UserResponse>> listB = listUsers(tokenB);
    assertThat(listA.getBody()).hasSize(1);
    assertThat(listB.getBody()).isEmpty();

    // Cache key must be tenant-scoped: tenant:{tenantId}:user:{userId}
    String expectedKey = "tenant:" + tenantA + ":user:" + created.id();
    try (var conn = redis.getConnection()) {
      assertThat(conn.keyCommands().exists(expectedKey.getBytes())).isTrue();
    }
  }

  private UserResponse postUser(String token, CreateUserRequest req) {
    HttpHeaders headers = authHeaders(token);
    headers.setContentType(MediaType.APPLICATION_JSON);
    ResponseEntity<UserResponse> res = rest.exchange(
        "/api/users",
        HttpMethod.POST,
        new HttpEntity<>(req, headers),
        UserResponse.class
    );
    assertThat(res.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    return res.getBody();
  }

  private ResponseEntity<UserResponse> getUser(String token, UUID id, HttpStatus expected) {
    HttpHeaders headers = authHeaders(token);
    ResponseEntity<UserResponse> res = rest.exchange(
        "/api/users/" + id,
        HttpMethod.GET,
        new HttpEntity<>(headers),
        UserResponse.class
    );
    assertThat(res.getStatusCode()).isEqualTo(expected);
    return res;
  }

  private ResponseEntity<String> getUserRaw(String token, UUID id) {
    HttpHeaders headers = authHeaders(token);
    return rest.exchange(
        "/api/users/" + id,
        HttpMethod.GET,
        new HttpEntity<>(headers),
        String.class
    );
  }

  private ResponseEntity<java.util.List<UserResponse>> listUsers(String token) {
    HttpHeaders headers = authHeaders(token);
    return rest.exchange(
        "/api/users",
        HttpMethod.GET,
        new HttpEntity<>(headers),
        new ParameterizedTypeReference<>() {}
    );
  }

  private static HttpHeaders authHeaders(String jwt) {
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(jwt);
    return headers;
  }
}
