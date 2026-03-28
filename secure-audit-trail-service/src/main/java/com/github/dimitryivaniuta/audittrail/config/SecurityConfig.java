package com.github.dimitryivaniuta.audittrail.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Basic security configuration.
 *
 * <p>This project uses HTTP Basic auth for simplicity. In production you would typically
 * use OAuth2/OIDC (JWT validation) with an external IdP.</p>
 *
 * <ul>
 *   <li>Writers (role AUDIT_WRITER) can append audit records.</li>
 *   <li>Auditors (role AUDITOR) can read/verify/export audit records.</li>
 * </ul>
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    /**
     * Configures security filter chain.
     *
     * @param http http security
     * @return chain
     * @throws Exception on configuration errors
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/audit/records").hasRole("AUDIT_WRITER")
                .requestMatchers("/api/audit/**").hasRole("AUDITOR")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }

    /**
     * Password encoder for in-memory/demo users.
     *
     * @return encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
