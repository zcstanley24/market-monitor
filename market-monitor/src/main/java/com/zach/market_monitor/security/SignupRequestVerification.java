package com.zach.market_monitor.security;

import com.zach.market_monitor.models.UserEntity;
import com.zach.market_monitor.services.UserService;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SignupRequestVerification {
    private final UserService userService;

    public SignupRequestVerification(UserService userService) {
        this.userService = userService;
    }

    public String verifySignup(UserSignupRequest signupRequest) {
        String username = signupRequest.getUsername();
        String password = signupRequest.getPassword();
        String followedStocks = signupRequest.getFollowedStocks();

        if(!userService.verifyFollowedStocks(followedStocks)) {
            return "One or more stock selections is invalid";
        }

        Optional<UserEntity> userOpt = userService.getUserByUsername(username);
        if(userOpt.isPresent()) {
            return "Username already exists";
        }
        if(username == null || username.length() < 8) {
            return "Username length must be at least 8 characters";
        }
        else if(username.length() > 30) {
            return "Username length cannot exceed 30 characters";
        }
        else if(password == null || password.length() < 8) {
            return "Password length must be at least 8 characters";
        }
        else if(password.length() > 30) {
            return "Password length cannot exceed 30 characters";
        }
        boolean hasUpperChar = false;
        boolean hasLowerChar = false;
        boolean hasNumberChar = false;
        boolean hasSpecialChar = false;
        for (char ch : password.toCharArray()) {
            if(Character.isUpperCase(ch)) hasUpperChar = true;
            else if (Character.isLowerCase(ch)) hasLowerChar = true;
            else if (Character.isDigit(ch)) hasNumberChar = true;
            else if ("!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~".indexOf(ch) >= 0) hasSpecialChar = true;
        }
        if(hasUpperChar && hasLowerChar && hasNumberChar && hasSpecialChar) {
            return "Valid";
        }
        else {
            return "Password must contain at least one lowercase, one uppercase, one numerical, and one special character";
        }
    }
}
