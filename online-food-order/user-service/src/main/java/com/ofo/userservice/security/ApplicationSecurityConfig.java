package com.ofo.userservice.security;

import static com.ofo.userservice.security.ApplicationPermission.OFO_USER;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;


/**
 * This class has the configuration and security rules added to all end points supported by this availability services
 *
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class ApplicationSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterAfter(new JWTTokenVerifier(), JWTAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/users").hasAnyAuthority(OFO_USER.name())
                        .requestMatchers(HttpMethod.GET, "users/{userId}").hasAnyAuthority(OFO_USER.name())
                        .requestMatchers(HttpMethod.PUT, "users/{userId}s").hasAnyAuthority(OFO_USER.name())
                        .requestMatchers(HttpMethod.DELETE, "users/{userId}}").hasAnyAuthority(OFO_USER.name())
                        .anyRequest()
                        .authenticated());

        return http.build();
    }
}
