package com.zach.market_monitor.controllers;

import com.zach.market_monitor.security.*;
import com.zach.market_monitor.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
    public ResponseEntity<?> login(@RequestBody UserCredentials loginRequest, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            String jwt = tokenProvider.generateToken(authentication);

            ResponseCookie cookie = ResponseCookie.from("marketMonitorToken", jwt)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(24 * 60 * 60) // 1 day
                    .sameSite("Lax")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok("Login successful");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {
            ResponseCookie cookie = ResponseCookie.from("marketMonitorToken", "")
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(0)
                    .sameSite("Lax")
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Encountered an error when expiring token");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserSignupRequest registrationRequest) {
        try {
            String signupCheckResult = signupRequestVerification.verifySignup(registrationRequest);
            if(signupCheckResult == "Valid") {
                userService.createUser(registrationRequest.getUsername(), registrationRequest.getPassword(), registrationRequest.getFollowedStocks());
                return ResponseEntity.status(HttpStatus.OK).body("Success");
            }
            else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(signupCheckResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unknown error occurred while registering new user");
        }
    }
}
