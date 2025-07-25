package com.zach.market_monitor.security;

import com.zach.market_monitor.models.UserEntity;
import com.zach.market_monitor.services.UserService;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class JwtHelper {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public JwtHelper(JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    public Optional<UserEntity> getUserFromJwt(String token) throws Exception {
        if (token == null) {
            throw new Exception("Missing JWT");
        }

        String username;
        Optional<UserEntity> userEntity;
        try {
            username = jwtTokenProvider.getUsernameFromToken(token);
            userEntity = userService.getUserByUsername(username);
        } catch (Exception e) {
            throw new Exception("Unable to verify user identity through JWT");
        }

        if(userEntity.isEmpty()) {
            throw new Exception("Unable to verify user identity through JWT");
        }

        return userEntity;
    }
}
