package com.gridbooks.infrastructure.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.Data;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "clients")
@Data
public class ClientEntity {
    @Id
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

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> preferences;
}
