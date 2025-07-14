package com.zach.market_monitor.security;

import com.zach.market_monitor.models.UserEntity;
import com.zach.market_monitor.services.CustomUserDetailsService;
import com.zach.market_monitor.services.UserService;
import org.springframework.stereotype.Component;

import java.util.Optional;
@Component
public class SignupRequestVerification {
    private final UserService userService;

    public SignupRequestVerification(UserService userService) {
        this.userService = userService;
    }

    public String verifySignup(UserCredentials signupRequest) {
        Optional<UserEntity> userOpt = userService.getUserByUsername(signupRequest.getUsername());
        if(userOpt.isPresent()) {
            return "Username already exists";
        }
        String password = signupRequest.getPassword();
        if(password == null || password.length() < 8) {
            return "Password must be at least 8 characters";
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
