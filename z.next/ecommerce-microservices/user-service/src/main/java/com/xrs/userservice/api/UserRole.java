package com.xrs.userservice.api;

import com.xrs.userservice.http.HeaderGenerator;
import com.xrs.userservice.service.RoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/role")
public class UserRole {
    private static final Logger log = LoggerFactory.getLogger(UserRole.class);

    private final RoleService roleService;
    private final HeaderGenerator headerGenerator;

    @Autowired
    public UserRole(RoleService roleService, HeaderGenerator headerGenerator) {
        this.roleService = roleService;
        this.headerGenerator = headerGenerator;
    }

    @PostMapping("/{id}/assign-roles")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> assignRoles(@PathVariable Long id, @RequestBody String roleNames) {
        boolean success = roleService.assignRole(id, roleNames);
        if (success) {
            return new ResponseEntity<>("Roles have been assigned to users with IDs " + id,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<>("Has full rights for the User" + id,
                headerGenerator.getHeadersForError(),
                HttpStatus.OK);
    }

    @PostMapping("/{id}/revoke-roles")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> revokeRoles(@PathVariable Long id, @RequestBody String roleNames) {
        boolean success = roleService.revokeRole(id, roleNames);
        if (success) {
            return new ResponseEntity<>("Roles have been assigned to users with IDs " + id,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<>("Has full rights for the User" + id,
                headerGenerator.getHeadersForError(),
                HttpStatus.OK);
    }

    @GetMapping("/{id}/user-roles")
    public ResponseEntity<List<String>> getUserRoles(@PathVariable Long id) {
        List<String> userRoles = roleService.getUserRoles(id);
        return new ResponseEntity<>(userRoles,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

}
