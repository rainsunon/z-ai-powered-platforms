package com.gridbooks.domain.model;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class Client {
    private String id;
    private String name;
    private String initials;
    private String color;
    private String email;
    private String mobile;
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDateTime memberTime;

    // JSONB content - stores user preferences like theme, notifications, etc.
    private Map<String, Object> preferences;
}
