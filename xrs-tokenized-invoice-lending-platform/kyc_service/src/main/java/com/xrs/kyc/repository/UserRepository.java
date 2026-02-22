package com.xrs.kyc.repository;

import com.xrs.kyc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> { }
