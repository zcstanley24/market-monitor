package com.zach.market_monitor.controllers;

import com.zach.market_monitor.security.JwtAuthenticationResponse;
import com.zach.market_monitor.security.JwtTokenProvider;
import com.zach.market_monitor.security.SignupRequestVerification;
import com.zach.market_monitor.security.UserCredentials;
import com.zach.market_monitor.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final SignupRequestVerification signupRequestVerification;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
                          UserService userService, SignupRequestVerification signupRequestVerification) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
        this.signupRequestVerification = signupRequestVerification;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserCredentials loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            String jwt = tokenProvider.generateToken(authentication);
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserCredentials registrationRequest) {
        try {
            String signupCheckResult = signupRequestVerification.verifySignup(registrationRequest);
            if(signupCheckResult == "Valid") {
                userService.createUser(registrationRequest.getUsername(), registrationRequest.getPassword());
                return ResponseEntity.status(HttpStatus.OK).body("Success");
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(signupCheckResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unknown error occurred while registering new user");
        }
    }

    @GetMapping("/test-username")
    public long testusername(@RequestParam(defaultValue = "AAPL") String symbol) {
        return userService.countUsers();
    }
}
