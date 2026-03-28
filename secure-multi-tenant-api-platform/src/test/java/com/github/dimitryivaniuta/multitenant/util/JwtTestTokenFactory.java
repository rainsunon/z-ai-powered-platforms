package com.github.dimitryivaniuta.multitenant.util;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StringUtils;

/**
 * Creates RS256 JWTs signed by test private keys.
 *
 * <p>The application validates JWTs via JWKS (asymmetric keys + rotation). Tests generate tokens with
 * different {@code kid}s to prove rotation compatibility.
 */
public final class JwtTestTokenFactory {

  private JwtTestTokenFactory() {
  }

  public static String createToken(String kid, String privateKeyClasspath, String issuer, String audience, UUID tenantId) {
    return createTokenInternal(kid, privateKeyClasspath, issuer, audience, tenantId);
  }

  public static String createTokenWithoutTenant(String kid, String privateKeyClasspath, String issuer, String audience) {
    return createTokenInternal(kid, privateKeyClasspath, issuer, audience, null);
  }

  private static String createTokenInternal(String kid, String privateKeyClasspath, String issuer, String audience, UUID tenantId) {
    try {
      RSAPrivateKey privateKey = loadRsaPrivateKey(privateKeyClasspath);
      JWSSigner signer = new RSASSASigner(privateKey);

      Instant now = Instant.now();
      Instant exp = now.plusSeconds(3600);

      JWTClaimsSet.Builder b = new JWTClaimsSet.Builder()
          .issuer(issuer)
          .audience(List.of(audience))
          .subject("test-user")
          .issueTime(Date.from(now))
          .expirationTime(Date.from(exp))
          .claim("scope", "users:read users:write");

      if (tenantId != null) {
        b.claim("tenantId", tenantId.toString());
      }

      SignedJWT jwt = new SignedJWT(
          new JWSHeader.Builder(JWSAlgorithm.RS256).keyID(kid).build(),
          b.build()
      );
      jwt.sign(signer);

      return jwt.serialize();
    } catch (JOSEException e) {
      throw new IllegalStateException("Failed to create test JWT", e);
    }
  }

  private static RSAPrivateKey loadRsaPrivateKey(String classpathLocation) {
    try {
      ClassPathResource res = new ClassPathResource(classpathLocation);
      try (BufferedReader br = new BufferedReader(new InputStreamReader(res.getInputStream(), StandardCharsets.UTF_8))) {
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
          if (line.startsWith("-----BEGIN") || line.startsWith("-----END")) {
            continue;
          }
          if (StringUtils.hasText(line)) {
            sb.append(line.trim());
          }
        }
        byte[] der = Base64.getDecoder().decode(sb.toString());
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(der);
        PrivateKey pk = KeyFactory.getInstance("RSA").generatePrivate(spec);
        return (RSAPrivateKey) pk;
      }
    } catch (Exception e) {
      throw new IllegalStateException("Failed to load RSA private key from classpath:" + classpathLocation, e);
    }
  }
}
