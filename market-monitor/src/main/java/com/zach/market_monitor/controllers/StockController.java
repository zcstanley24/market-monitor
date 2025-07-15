package com.zach.market_monitor.controllers;

import com.zach.market_monitor.models.UserEntity;
import com.zach.market_monitor.repositories.UserRepository;
import com.zach.market_monitor.security.JwtTokenProvider;
import com.zach.market_monitor.services.APIService;
import com.zach.market_monitor.services.UserService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;

@RestController
public class StockController {
    private final APIService apiService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public StockController(APIService apiService, JwtTokenProvider jwtTokenProvider, UserService userService) {

        this.apiService = apiService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @GetMapping("/test")
    public String test() {
        return "Hello, world!";
    }

    @GetMapping("/price2")
    public String price2(@RequestParam(defaultValue = "AAPL") String symbol) {
        return apiService.getCurrentPrice(symbol);
    }

    @Cacheable(cacheNames = "quotes")
    @GetMapping("/quote")
    public String quote(@RequestParam(defaultValue = "AAPL") String symbol, @RequestParam(defaultValue = "1day") String interval) {
        return apiService.getQuote(symbol, interval);
    }

    @Cacheable(cacheNames = "stocks", unless = "#result.statusCodeValue != 200")
    @GetMapping("/stock-data")
    public ResponseEntity<?> stockData(@CookieValue(value = "marketMonitorToken", required = false) String cookieValue) {
        if (cookieValue == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing cookie");
        }

        String username = null;
        Optional<UserEntity> userEntity;
        try {
            username = jwtTokenProvider.getUsernameFromToken(cookieValue);
            userEntity = userService.getUserByUsername(username);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unable to verify user identity through cookie");
        }

        if(userEntity.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unable to verify user identity through cookie");
        }

        String quoteInfo = "";
        try {
            quoteInfo = apiService.getQuote(userEntity.get().getFollowedStocks(), "1day");
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching stock information");
        }
        return ResponseEntity.ok(quoteInfo);
    }

    @CacheEvict(cacheNames = "stocks", key = "#cookieValue")
    @PutMapping("/followed-stocks")
    public ResponseEntity<?> followedStocks(@CookieValue(value = "marketMonitorToken", required = false) String cookieValue, @RequestBody String symbols) {
        if (cookieValue == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing cookie");
        }

        String username = null;
        Optional<UserEntity> userEntity;
        try {
            username = jwtTokenProvider.getUsernameFromToken(cookieValue);
            userEntity = userService.getUserByUsername(username);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unable to verify user identity through cookie");
        }

        if(userEntity.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unable to verify user identity through cookie");
        }
        else if(symbols == null || symbols.isBlank() || !userService.verifyFollowedStocks(symbols)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid stock symbols");
        }
        try {
            userService.updateFollowedStocks(userEntity.get().getId(), symbols);
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unknown error occurred while updating followed stocks");
        }
    }
}
