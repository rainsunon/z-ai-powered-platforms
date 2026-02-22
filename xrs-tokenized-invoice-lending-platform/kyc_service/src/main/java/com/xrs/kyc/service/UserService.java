package com.xrs.kyc.service;

import com.xrs.kyc.common.KycStatus;
import com.xrs.kyc.entity.User;
import com.xrs.kyc.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {
        user.setKycStatus(KycStatus.PENDING);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}