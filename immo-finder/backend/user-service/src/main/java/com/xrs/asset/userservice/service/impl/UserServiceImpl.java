package com.xrs.asset.userservice.service.impl;

import com.xrs.assetmanagementsystem.dto.CreateUserDto;
import com.xrs.assetmanagementsystem.dto.UserDTO;
import com.xrs.assetmanagementsystem.dto.UserDetailsDTO;
import com.xrs.assetmanagementsystem.entity.Department;
import com.xrs.assetmanagementsystem.entity.Role;
import com.xrs.assetmanagementsystem.entity.User;
import com.xrs.assetmanagementsystem.errors.ApiReturnCode;
import com.xrs.assetmanagementsystem.exception.BusinessException;
import com.xrs.assetmanagementsystem.mapper.UserDetailsMapper;
import com.xrs.assetmanagementsystem.mapper.UserMapper;
import com.xrs.asset.userservice.repository.DepartmentRepository;
import com.xrs.asset.userservice.repository.RoleRepository;
import com.xrs.asset.userservice.repository.UserRepository;
import com.xrs.asset.userservice.service.AuthService;
import com.xrs.asset.userservice.service.UserService;
import com.xrs.assetmanagementsystem.specification.UserSpecifications;
import com.xrs.assetmanagementsystem.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Transactional
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public Page<UserDTO> searchUsers(String searchWord, String role, Long departmentId, Pageable pageable) {
        User user = SecurityUtils.getCurrentUser();
        String userRole = user.getRole().getName();
        if ("DEPARTMENT_MANAGER".equals(userRole))
            departmentId = user.getDepartment().getId();

        Specification<User> spec = Specification.allOf();
        if (searchWord != null && !searchWord.trim().isEmpty()) {
            spec = spec.and(UserSpecifications.hasNameOrEmail(searchWord));
        }
        if (role != null && !role.trim().isEmpty()) {
            spec = spec.and(UserSpecifications.hasRole(role));
        }
        if (departmentId != null) {
            spec = spec.and(UserSpecifications.inDepartment(departmentId));
        }
        Page<User> users = userRepository.findAll(spec, pageable);
        return UserMapper.toDtoPage(users);

    }
    
    @Override
    public UserDetailsDTO getUserDetailsById(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ApiReturnCode.USER_NOT_EXISTS,
                        "User not found with id: " + id
                ));

        return UserDetailsMapper.toDto(user);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        ApiReturnCode.USER_NOT_EXISTS,
                        "User not found with id: " + id
                ));
        return UserMapper.toDto(user);
    }

    @Override
    public UserDTO createUser(CreateUserDto createUserDto) {
        // Check if email already exists
        if (userRepository.existsByEmail(createUserDto.getEmail())) {
            throw new BusinessException(
                    ApiReturnCode.USER_ALREADY_EXISTS,
                    "User with email '" + createUserDto.getEmail() + "' already exists"
            );
        }

        // Check if username already exists
        if (userRepository.findByUsername(createUserDto.getUsername()) != null) {
            throw new BusinessException(
                    ApiReturnCode.USER_ALREADY_EXISTS,
                    "User with username '" + createUserDto.getUsername() + "' already exists"
            );
        }

        // Get role
        Role role = roleRepository.findById(createUserDto.getRoleId())
                .orElseThrow(() -> new BusinessException(
                        ApiReturnCode.ROLE_NOT_EXISTS,
                        "Role not found with id: " + createUserDto.getRoleId()
                ));

        // Get department if provided
        Department department = null;
        if (createUserDto.getDepartmentId() != null) {
            department = departmentRepository.findById(createUserDto.getDepartmentId())
                    .orElseThrow(() -> new BusinessException(
                            ApiReturnCode.DEPARTMENT_NOT_EXISTS,
                            "Department not found with id: " + createUserDto.getDepartmentId()
                    ));
        }

        // Create user
        User user = new User();
        user.setUsername(createUserDto.getUsername());
        user.setEmail(createUserDto.getEmail());
        user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));
        user.setFullName(createUserDto.getFullName());
        user.setRole(role);
        user.setDepartment(department);
        user.setPhone(createUserDto.getPhone());
        user.setHireDate(createUserDto.getHireDate());
        user.setIsActive(true);
        user.setCreatedAt(LocalDate.now());
        user.setUpdatedAt(LocalDate.now());

        User savedUser = userRepository.save(user);
        return UserMapper.toDto(savedUser);
    }

    @Override
    public UserDetailsDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new BusinessException(
                    ApiReturnCode.USER_NOT_EXISTS,
                    "User not found with email: " + email
            );
        }
        return UserDetailsMapper.toDto(user);
    }

    @Override
    public java.util.Map<String, Long> getUserStats() {
        long total = userRepository.count();
        long active = userRepository.findAll().stream()
                .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                .count();
        
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("total", total);
        stats.put("active", active);
        return stats;
    }
}
