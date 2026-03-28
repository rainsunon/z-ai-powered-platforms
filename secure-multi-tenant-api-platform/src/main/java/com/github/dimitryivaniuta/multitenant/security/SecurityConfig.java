package com.github.dimitryivaniuta.multitenant.security;

import com.github.dimitryivaniuta.multitenant.observability.CorrelationIdFilter;
import com.github.dimitryivaniuta.multitenant.security.jwks.JwksKeyRing;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration.
 *
 * <p>The API expects Bearer JWT tokens. Each token must include a {@code tenantId} claim.
 *
 * <p>JWT signature validation uses a local JWKS key set (asymmetric RSA keys) to support rotation:
 * keep multiple active public keys in {@code /.well-known/jwks.json}.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(authz -> authz
            .requestMatchers("/actuator/health", "/actuator/info").permitAll()
            .requestMatchers(HttpMethod.GET, "/").permitAll()
            .requestMatchers("/.well-known/jwks.json").permitAll()
            .requestMatchers("/api/**").authenticated()
            .anyRequest().denyAll())
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

    // Correlation id first (useful even for unauthenticated responses).
    http.addFilterBefore(new CorrelationIdFilter(), BearerTokenAuthenticationFilter.class);

    // Populate tenant context after authentication.
    http.addFilterAfter(new TenantContextFilter(), BearerTokenAuthenticationFilter.class);

    return http.build();
  }

  /**
   * JWT decoder based on an in-memory JWKS set (asymmetric RSA keys).
   *
   * <p>Rotation model: JWKS contains multiple public keys. Tokens may use any {@code kid} present.
   */
  @Bean
  public JwtDecoder jwtDecoder(JwtProperties props, JwksKeyRing keyRing) {
    JWKSource<SecurityContext> jwkSource = new ImmutableJWKSet<>(keyRing.publicJwkSet());
    NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSource(jwkSource).build();

    OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(props.issuer());
    OAuth2TokenValidator<Jwt> withAudience = new AudienceValidator(props.audience());
    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer, withAudience));

    return decoder;
  }
}
