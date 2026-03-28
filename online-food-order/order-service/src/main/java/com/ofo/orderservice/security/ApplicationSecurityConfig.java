package com.ofo.orderservice.security;

import static com.ofo.orderservice.security.ApplicationPermission.OFO_ADMIN;
import static com.ofo.orderservice.security.ApplicationPermission.OFO_USER;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

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
                        .requestMatchers(HttpMethod.POST, "/order").hasAnyAuthority(OFO_USER.name(), OFO_ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/order").hasAnyAuthority(OFO_USER.name(), OFO_ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/order/{userId}").hasAnyAuthority(OFO_USER.name(), OFO_ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/order/{restaurantId}").hasAnyAuthority(OFO_USER.name(), OFO_ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/order/{orderId}").hasAnyAuthority(OFO_USER.name(), OFO_ADMIN.name())
                        .anyRequest()
                        .authenticated());

        return http.build();
    }
}
