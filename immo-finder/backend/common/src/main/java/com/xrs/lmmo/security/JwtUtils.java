package com.xrs.asset.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwtSecret:SecretKeyMustBeLongEnoughForHS512AlgorithmSoItShouldBeAtLeast64BytesLongStringForSecurityReasons1234567890}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs:86400000}")
    private int jwtExpirationMs;

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(generateSafeSecret()));
    }

    // Helper to ensure we have a valid base64 key even if property is plain text
    private String generateSafeSecret() {
        // If the secret is not base64 encoded or too short, we might default or encode it.
        // For simplicity in this migration, let's assume the property provided or default 
        // is a plain string that we can just use bytes from, or use a hardcoded safe base64 for dev.
        // Actually, let's just use a hardcoded Base64 string if the property is not provided correctly,
        // but typically better to encode the string.
        // For this task, I'll use a fixed Base64 string for the default to avoid decoding errors.
        // The default value in @Value above is long but not Base64.
        // Let's ignore the injected value if it's the default text and return a known Base64 key
        if (jwtSecret.startsWith("SecretKeyMustBe")) {
            // HS512 requires at least 512 bits (64 bytes). This Base64 string encodes a sufficiently long key.
            return "VGhpcyBJcyBBIFZlcnkgTG9uZyBTZWNyZXQgS2V5IFR1ciBEYXQgSXMgRGVmaW5pdGVseSBNb3JlIFRoYW4gU2l4dHkgRm91ciBCeXRlcyBMb25nIEZvciBTdXJlIFRvIFNhdGlzZnkgSFM1MTIgU2VjdXJpdHkgUmVxdWlyZW1lbnRzIDEyMzQ1Njc4OTA="; 
        }
        return jwtSecret;
    }

    public String generateJwtToken(Authentication authentication) {
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userPrincipal.getUser().getId());
        claims.put("email", userPrincipal.getUser().getEmail());
        claims.put("role", userPrincipal.getUser().getRole().getName());
        claims.put("fullName", userPrincipal.getUser().getFullName());
        
        if (userPrincipal.getUser().getDepartment() != null) {
            claims.put("departmentId", userPrincipal.getUser().getDepartment().getId());
            claims.put("departmentName", userPrincipal.getUser().getDepartment().getName());
        }

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userPrincipal.getUsername()) // This is email based on CustomUserDetails implementation
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
    
    public Claims getClaimsFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }
}
