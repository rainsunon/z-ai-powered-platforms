package com.xrs.gateway.uploads.api;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.xrs.gateway.security.KeycloakJwtAuthConverter;
import com.xrs.gateway.security.SecurityConfig;
import com.xrs.gateway.uploads.service.UploadService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.Instant;
import java.util.Map;

@WebMvcTest(controllers = UploadController.class)
@Import({SecurityConfig.class, KeycloakJwtAuthConverter.class})
class UploadControllerSecurityTest {

  @Autowired MockMvc mvc;

  @MockBean UploadService service;

  @TestConfiguration
  static class JwtDecoderConfig {
    @Bean
    JwtDecoder jwtDecoder() {
      return token -> Jwt.withTokenValue(token)
        .header("alg", "none")
        .claim("sub", "user")
        .issuedAt(Instant.now())
        .expiresAt(Instant.now().plusSeconds(3600))
        .build();
    }
  }

  @Test
  void unauthorizedWithoutJwt() throws Exception {
    mvc.perform(post("/api/uploads")
        .contentType("application/json")
        .content("{"fileName":"a.mp4","contentType":"video/mp4","fileSize":1}"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  void authorizedWithUploaderRole() throws Exception {
    when(service.create(any(), any(), anyString())).thenThrow(new RuntimeException("should not be called"));

    mvc.perform(post("/api/uploads")
        .with(jwt().jwt(j -> j.claim("realm_access", Map.of("roles", java.util.List.of("uploader")))))
        .contentType("application/json")
        .content("{"fileName":"a.mp4","contentType":"video/mp4","fileSize":1}"))
      .andExpect(status().is5xxServerError()); // service throws; proves auth passed

    verify(service, times(1)).create(any(), any(), anyString());
  }
}
