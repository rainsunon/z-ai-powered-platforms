package com.xrs.gateway.security;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

/**
 * Extracts Keycloak realm roles (realm_access.roles) and OAuth2 scopes into Spring Security authorities.
 */
@Component
public class KeycloakJwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

  @Override
  public AbstractAuthenticationToken convert(Jwt jwt) {
    Set<SimpleGrantedAuthority> authorities = new HashSet<>();
    authorities.addAll(realmRoles(jwt));
    authorities.addAll(scopes(jwt));
    return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
  }

  private Set<SimpleGrantedAuthority> realmRoles(Jwt jwt) {
    Object realmAccess = jwt.getClaim("realm_access");
    if (!(realmAccess instanceof Map<?, ?> m)) {
      return Set.of();
    }
    Object roles = m.get("roles");
    if (!(roles instanceof Collection<?> c)) {
      return Set.of();
    }
    return c.stream()
      .filter(Objects::nonNull)
      .map(Object::toString)
      .map(r -> "ROLE_" + r.toUpperCase(Locale.ROOT))
      .map(SimpleGrantedAuthority::new)
      .collect(Collectors.toSet());
  }

  private Set<SimpleGrantedAuthority> scopes(Jwt jwt) {
    String scope = jwt.getClaimAsString("scope");
    if (scope == null || scope.isBlank()) {
      return Set.of();
    }
    return Arrays.stream(scope.split("\\s+"))
      .filter(s -> !s.isBlank())
      .map(s -> "SCOPE_" + s)
      .map(SimpleGrantedAuthority::new)
      .collect(Collectors.toSet());
  }
}
