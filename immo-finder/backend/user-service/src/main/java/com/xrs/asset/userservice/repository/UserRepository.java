package com.xrs.asset.userservice.repository;

import com.xrs.assetmanagementsystem.entity.Department;
import com.xrs.assetmanagementsystem.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    User findByUsername(String email);
    User findByEmail(String email);
    Page<User> findByDepartment_Id(Long departmentId, Pageable pageable);
    List<User> findAllByDepartment(Department department);
    boolean existsByEmail(String email);
}
