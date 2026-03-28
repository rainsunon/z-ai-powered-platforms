package com.xrs.immo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JwtResponse extends UserDTO {
    private String token;

    public JwtResponse(String token, Long id, String username, String fullName, String email, String role, String departmentName, Long departmentId) {
        super(id, username, fullName, email, role, departmentName, departmentId);
        this.token = token;
    }
}
