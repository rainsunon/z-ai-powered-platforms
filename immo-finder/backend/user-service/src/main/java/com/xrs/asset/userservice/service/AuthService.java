package com.xrs.asset.userservice.service;

import com.xrs.assetmanagementsystem.dto.UserDTO;
import com.xrs.assetmanagementsystem.mapper.UserMapper;
import org.springframework.stereotype.Service;
import com.xrs.assetmanagementsystem.entity.User;

@Service
public class AuthService {

    private final UserMapper userMapper;

    public AuthService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public final UserDTO fromEntity(User user) {
        return userMapper.toDto(user);
    }

}
