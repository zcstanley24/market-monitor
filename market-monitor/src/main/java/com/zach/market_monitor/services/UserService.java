package com.zach.market_monitor.services;

import com.zach.market_monitor.models.UserEntity;
import com.zach.market_monitor.repositories.UserRepository;
import com.zach.market_monitor.security.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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

    public UserEntity createUser(String username, String password, String followedStocks) {
        String encodedPassword = securityConfig.passwordEncoder().encode(password);
        UserEntity userCandidate = new UserEntity();
        userCandidate.setUsername(username);
        userCandidate.setPassword(encodedPassword);
        userCandidate.setFollowedStocks(followedStocks);
        userCandidate.setRoles(Set.of("USER"));
        return userRepository.save(userCandidate);
    }

    public UserEntity updateFollowedStocks(long userId, String followedStocks) {
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userEntity.setFollowedStocks(followedStocks);
        return userRepository.save(userEntity);
    }

    public boolean verifyFollowedStocks(String candidateStocks) {
        Set<String> allowedStocks = Set.of("T", "AVGO", "COST", "LLY", "XOM", "HD", "JPM", "JNJ", "MA", "META",
                "MSFT", "NFLX", "NVDA", "ORCL", "TGT", "TSLA", "TMUS", "VZ", "V", "WMT");
        Set<String> candidateStocksSet = Arrays.stream(candidateStocks.split(",")).collect(Collectors.toSet());
        return allowedStocks.containsAll(candidateStocksSet);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public long countUsers() { return userRepository.count(); }
}
