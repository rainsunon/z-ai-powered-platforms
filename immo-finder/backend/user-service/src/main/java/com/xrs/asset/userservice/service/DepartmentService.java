package com.xrs.asset.userservice.service;

import com.xrs.assetmanagementsystem.dto.DepartmentDto;
import com.xrs.assetmanagementsystem.entity.Department;

import java.util.List;

public interface DepartmentService {
    List<Department> getAllDepartments();
    Department getDepartmentById(Long id);
    Department createDepartment(DepartmentDto departmentDto);
    Department updateDepartment(Long id, DepartmentDto departmentDto);
    void deleteDepartment(Long id);
}

