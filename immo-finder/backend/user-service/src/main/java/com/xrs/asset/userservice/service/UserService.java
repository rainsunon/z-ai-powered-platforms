package com.xrs.asset.userservice.service;

import com.xrs.assetmanagementsystem.dto.CreateUserDto;
import com.xrs.assetmanagementsystem.dto.UserDTO;
import com.xrs.assetmanagementsystem.dto.UserDetailsDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDTO> searchUsers(String searchWord, String role, Long departmentId, Pageable pageable);
    UserDetailsDTO getUserDetailsById(long id);
    UserDTO getUserById(Long id);
    UserDTO createUser(CreateUserDto createUserDto);
    UserDetailsDTO getUserByEmail(String email);
    java.util.Map<String, Long> getUserStats();
}
