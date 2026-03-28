package com.xrs.asset.mapper;

import com.xrs.asset.dto.UserDetailsDTO;
import com.xrs.asset.entity.User;

public class UserDetailsMapper {
    public static UserDetailsDTO toDto(User user) {
        if (user == null) {
            return null;
        }
        UserDetailsDTO userDetailsDTO = new UserDetailsDTO();
        userDetailsDTO.setId(user.getId());
        userDetailsDTO.setEmail(user.getEmail());
        userDetailsDTO.setRole(user.getRole().getName());
        userDetailsDTO.setDepartmentName(user.getDepartment().getName());
        userDetailsDTO.setDepartmentId(user.getDepartment().getId());
        userDetailsDTO.setUsername(user.getUsername());
        userDetailsDTO.setFullName(user.getFullName());
        userDetailsDTO.setPhone(user.getPhone());
        userDetailsDTO.setHireDate(user.getHireDate());
        userDetailsDTO.setIsActive(user.getIsActive());
        userDetailsDTO.setPassword(user.getPassword()); // Required for authentication in other services
        return userDetailsDTO;
    }
}

