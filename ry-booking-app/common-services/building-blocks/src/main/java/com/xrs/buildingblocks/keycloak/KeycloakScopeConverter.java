package com.xrs.buildingblocks.keycloak;


import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Rui S.
 * @date 2026-02-03
 * @apiNote
 */
public class KeycloakScopeConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private static final String SCOPE_PREFIX = "SCOPE_";

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // 1. Handle space-separated scope string
        String scopeAsString = jwt.getClaimAsString("scope");
        if (scopeAsString != null) {
            Arrays.stream(scopeAsString.split(" ")).forEach(scope -> {
                authorities.add(new SimpleGrantedAuthority(SCOPE_PREFIX + scope));
                authorities.add(new SimpleGrantedAuthority(scope));
            });
        }

        // 2. Handle array of scopes (defensive: avoid unchecked cast)
        Object scopeObject = jwt.getClaim("scope");
        if (scopeObject instanceof Collection) {
            Collection<?> raw = (Collection<?>) scopeObject;
            for (Object o : raw) {
                if (o == null) continue;
                String scope = String.valueOf(o);
                authorities.add(new SimpleGrantedAuthority(SCOPE_PREFIX + scope));
                authorities.add(new SimpleGrantedAuthority(scope));
            }
        }

        // 3. Handle scp claim (alternative scope claim)
        Object scpObject = jwt.getClaim("scp");
        if (scpObject instanceof Collection) {
            Collection<?> raw = (Collection<?>) scpObject;
            for (Object o : raw) {
                if (o == null) continue;
                String scope = String.valueOf(o);
                authorities.add(new SimpleGrantedAuthority(SCOPE_PREFIX + scope));
                authorities.add(new SimpleGrantedAuthority(scope));
            }
        }

        return authorities;
    }
}
