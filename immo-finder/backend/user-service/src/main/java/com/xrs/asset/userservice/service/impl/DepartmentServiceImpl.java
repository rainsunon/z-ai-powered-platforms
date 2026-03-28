package com.xrs.asset.userservice.service.impl;

import com.xrs.assetmanagementsystem.dto.DepartmentDto;
import com.xrs.assetmanagementsystem.entity.Department;
import com.xrs.asset.userservice.repository.DepartmentRepository;
import com.xrs.asset.userservice.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    @Override
    public Department createDepartment(DepartmentDto departmentDto) {
        if (departmentRepository.findByName(departmentDto.getName()) != null) {
            throw new RuntimeException("Department with name '" + departmentDto.getName() + "' already exists");
        }
        
        Department department = new Department();
        department.setName(departmentDto.getName());
        
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(Long id, DepartmentDto departmentDto) {
        Department department = getDepartmentById(id);
        
        // Check if name is being changed and if new name already exists
        if (!department.getName().equals(departmentDto.getName())) {
            Department existingDepartment = departmentRepository.findByName(departmentDto.getName());
            if (existingDepartment != null && !existingDepartment.getId().equals(id)) {
                throw new RuntimeException("Department with name '" + departmentDto.getName() + "' already exists");
            }
        }
        
        department.setName(departmentDto.getName());
        
        return departmentRepository.save(department);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}

