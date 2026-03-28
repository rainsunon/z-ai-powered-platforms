package com.xrs.history.service.security;

import com.xrs.assetmanagementsystem.dto.UserDetailsDTO;
import com.xrs.assetmanagementsystem.entity.Department;
import com.xrs.assetmanagementsystem.entity.Role;
import com.xrs.assetmanagementsystem.entity.User;
import com.xrs.assetmanagementsystem.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * CustomUserDetailsService for History Service
 * Calls the User Service API to authenticate users instead of directly accessing the database
 * This follows microservices best practices - each service communicates via APIs
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final RestTemplate restTemplate;
    
    @Value("${service.user.url}")
    private String userServiceUrl;

    public CustomUserDetailsService() {
        this.restTemplate = new RestTemplate();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username.isBlank()) {
            throw new UsernameNotFoundException("Email is null");
        }

        try {
            // Call User Service API to get user details by email
            String url = userServiceUrl + "/api/users/by-email?email=" + username;
            UserDetailsDTO userDto = restTemplate.getForObject(url, UserDetailsDTO.class);
            
            if (userDto == null) {
                throw new UsernameNotFoundException("User not found: " + username);
            }

            // Convert DTO to User entity for CustomUserDetails
            User user = convertToUser(userDto);
            return new CustomUserDetails(user);
            
        } catch (Exception e) {
            throw new UsernameNotFoundException("User not found: " + username, e);
        }
    }

    private User convertToUser(UserDetailsDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        user.setHireDate(dto.getHireDate());
        user.setIsActive(dto.getIsActive());
        user.setCreatedAt(dto.getCreatedAt());
        user.setUpdatedAt(dto.getUpdatedAt());

        // Set Role
        Role role = new Role();
        role.setId(dto.getRoleId());
        role.setName(dto.getRoleName());
        user.setRole(role);

        // Set Department if exists
        if (dto.getDepartmentId() != null) {
            Department dept = new Department();
            dept.setId(dto.getDepartmentId());
            dept.setName(dto.getDepartmentName());
            user.setDepartment(dept);
        }

        return user;
    }
}

