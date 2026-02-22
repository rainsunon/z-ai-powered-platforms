package com.xrs.gateway.config;

import java.net.URI;
import java.util.Optional;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

/**
 * AWS SDK clients configuration.
 *
 * <p>Uses {@link DefaultCredentialsProvider} so local development can rely on
 * environment variables, shared credentials/profile, or IAM role when deployed.</p>
 */
@Configuration
@EnableConfigurationProperties({S3Properties.class, UploadPolicyProperties.class, CorsProperties.class})
public class AwsS3Config {

  @Bean
  public DefaultCredentialsProvider defaultCredentialsProvider() {
    return DefaultCredentialsProvider.create();
  }

  @Bean
  public S3Client s3Client(S3Properties props, DefaultCredentialsProvider creds) {
    var builder = S3Client.builder()
      .credentialsProvider(creds)
      .region(Region.of(props.getRegion()))
      .serviceConfiguration(S3Configuration.builder()
        .checksumValidationEnabled(true)
        .build());

    endpointOverride(props).ifPresent(builder::endpointOverride);
    return builder.build();
  }

  @Bean
  public S3Presigner s3Presigner(S3Properties props, DefaultCredentialsProvider creds) {
    var builder = S3Presigner.builder()
      .credentialsProvider(creds)
      .region(Region.of(props.getRegion()));

    endpointOverride(props).ifPresent(builder::endpointOverride);
    return builder.build();
  }

  private Optional<URI> endpointOverride(S3Properties props) {
    return Optional.ofNullable(props.getEndpoint())
      .map(String::trim)
      .filter(s -> !s.isBlank())
      .map(URI::create);
  }
}
