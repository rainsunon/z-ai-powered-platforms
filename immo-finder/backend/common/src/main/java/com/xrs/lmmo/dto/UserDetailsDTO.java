    package com.xrs.immo.dto;

    import lombok.Getter;
    import lombok.Setter;

    import java.time.LocalDate;

    @Setter
    @Getter
    public class UserDetailsDTO {
        private Long id;
        private String username;
        private String fullName;
        private String email;
        private String password; // Needed for authentication
        private String phone;
        private String role;
        private Long roleId;
        private String roleName;
        private Long departmentId;
        private String departmentName;
        private LocalDate hireDate;
        private Boolean isActive;
        private LocalDate createdAt;
        private LocalDate updatedAt;
    }
