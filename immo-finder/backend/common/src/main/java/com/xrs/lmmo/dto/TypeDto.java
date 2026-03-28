package com.xrs.immo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypeDto {
    @NotBlank(message = "Type name cannot be empty")
    private String name;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}

