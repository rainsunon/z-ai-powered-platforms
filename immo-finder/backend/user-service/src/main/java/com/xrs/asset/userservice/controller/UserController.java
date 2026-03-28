package com.xrs.asset.userservice.controller;

import jakarta.validation.Valid;
import com.xrs.assetmanagementsystem.dto.CreateUserDto;
import com.xrs.assetmanagementsystem.dto.UserDTO;
import com.xrs.assetmanagementsystem.dto.UserDetailsDTO;
import com.xrs.asset.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('IT') or hasAuthority('DEPARTMENT_MANAGER')")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long departmentId
    ) {
        Page<UserDTO> userDTOPage = userService.searchUsers(search, role, departmentId, pageable);
        return ResponseEntity.ok(userDTOPage);
    }

    @GetMapping("/details/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDetailsDTO> getUserDetailsById(@PathVariable Long id) {
        UserDetailsDTO dto = userService.getUserDetailsById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO dto = userService.getUserById(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserDto createUserDto) {
        UserDTO userDTO = userService.createUser(createUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDTO);
    }

    /**
     * Get user by email - used for authentication by other microservices
     * Returns UserDetailsDTO which includes password hash for authentication
     */
    @GetMapping("/by-email")
    public ResponseEntity<UserDetailsDTO> getUserByEmail(@RequestParam String email) {
        UserDetailsDTO dto = userService.getUserByEmail(email);
        return ResponseEntity.ok(dto);
    }

    /**
     * Get user statistics - used by Dashboard Service
     */
    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Long>> getUserStats() {
        java.util.Map<String, Long> stats = userService.getUserStats();
        return ResponseEntity.ok(stats);
    }
}

