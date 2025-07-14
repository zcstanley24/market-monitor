package com.zach.market_monitor.services;

import com.zach.market_monitor.models.UserEntity;
import com.zach.market_monitor.repositories.UserRepository;
import com.zach.market_monitor.security.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SecurityConfig securityConfig;

    @Autowired
    public UserService(UserRepository userRepository, SecurityConfig securityConfig) {

        this.userRepository = userRepository;
        this.securityConfig = securityConfig;
    }

    public Optional<UserEntity> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public UserEntity createUser(String username, String password) {
        String encodedPassword = securityConfig.passwordEncoder().encode(password);
        UserEntity userCandidate = new UserEntity();
        userCandidate.setUsername(username);
        userCandidate.setPassword(encodedPassword);
        userCandidate.setRoles(Set.of("USER"));
        return userRepository.save(userCandidate);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public long countUsers() { return userRepository.count(); }
}
