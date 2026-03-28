package com.github.dimitryivaniuta.multitenant.security.jwks;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;

/**
 * PEM utilities for loading RSA public keys.
 *
 * <p>Expected format: X.509 SubjectPublicKeyInfo PEM:
 * <pre>
 * -----BEGIN PUBLIC KEY-----
 * ...
 * -----END PUBLIC KEY-----
 * </pre>
 */
public final class PemKeyUtils {

  private PemKeyUtils() {
  }

  /**
   * Loads an RSA public key from a PEM resource.
   *
   * @param resource resource that contains a PUBLIC KEY PEM
   * @return RSA public key
   */
  public static RSAPublicKey loadRsaPublicKey(Resource resource) {
    try (BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
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
      X509EncodedKeySpec spec = new X509EncodedKeySpec(der);

      KeyFactory kf = KeyFactory.getInstance("RSA");
      PublicKey pk = kf.generatePublic(spec);
      if (!(pk instanceof RSAPublicKey rsa)) {
        throw new IllegalArgumentException("Not an RSA public key: " + resource);
      }
      return rsa;
    } catch (Exception e) {
      throw new IllegalStateException("Failed to load RSA public key from " + resource, e);
    }
  }
}
