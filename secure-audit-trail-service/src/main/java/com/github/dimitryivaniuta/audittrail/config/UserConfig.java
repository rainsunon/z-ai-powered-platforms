package com.github.dimitryivaniuta.audittrail.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

/**
 * Creates in-memory users for local/demo usage.
 *
 * <p>Credentials are configurable via application properties:</p>
 * <ul>
 *   <li>{@code audit.security.writer.username}</li>
 *   <li>{@code audit.security.writer.password}</li>
 *   <li>{@code audit.security.auditor.username}</li>
 *   <li>{@code audit.security.auditor.password}</li>
 * </ul>
 */
@Configuration
public class UserConfig {

    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder,
            @Value("${audit.security.writer.username:writer}") String writerUser,
            @Value("${audit.security.writer.password:writer-pass}") String writerPass,
            @Value("${audit.security.auditor.username:auditor}") String auditorUser,
            @Value("${audit.security.auditor.password:auditor-pass}") String auditorPass) {

        return new InMemoryUserDetailsManager(
                User.withUsername(writerUser)
                        .password(passwordEncoder.encode(writerPass))
                        .roles("AUDIT_WRITER")
                        .build(),
                User.withUsername(auditorUser)
                        .password(passwordEncoder.encode(auditorPass))
                        .roles("AUDITOR")
                        .build()
        );
    }
}
