package com.xrs.asset.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.xrs.asset.entity.Department;
import com.xrs.asset.entity.Role;
import com.xrs.asset.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    // Optional: We can still inject UserDetailsService if we want to load from DB, 
    // but building from token is better for performance in microservices.
    // private UserDetailsService userDetailsService; 

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                Claims claims = jwtUtils.getClaimsFromJwtToken(jwt);
                String username = claims.getSubject();

                // Reconstruct User from JWT Claims to avoid DB call
                User user = new User();
                user.setEmail(username);
                user.setUsername(username);
                
                Object idObj = claims.get("id");
                if (idObj instanceof Number) {
                    user.setId(((Number) idObj).longValue());
                }

                String roleName = (String) claims.get("role");
                if (roleName != null) {
                    Role role = new Role();
                    role.setName(roleName);
                    // Determine role ID if possible, or just rely on name (usually name is enough for authorities)
                    user.setRole(role);
                }

                Object deptIdObj = claims.get("departmentId");
                if (deptIdObj instanceof Number) {
                    Department dept = new Department();
                    dept.setId(((Number) deptIdObj).longValue());
                    dept.setName((String) claims.get("departmentName"));
                    user.setDepartment(dept);
                }

                CustomUserDetails userDetails = new CustomUserDetails(user);
                
                UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}
