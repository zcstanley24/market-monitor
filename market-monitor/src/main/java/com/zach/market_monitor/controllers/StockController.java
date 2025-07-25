package com.zach.market_monitor.controllers;

import com.zach.market_monitor.models.StockValueEntity;
import com.zach.market_monitor.models.UserEntity;
import com.zach.market_monitor.security.JwtHelper;
import com.zach.market_monitor.security.JwtTokenProvider;
import com.zach.market_monitor.services.ApiService;
import com.zach.market_monitor.services.StockValueService;
import com.zach.market_monitor.services.UserService;
import com.zach.market_monitor.utils.StockPriceResponse;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class StockController {
    private final ApiService apiService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final StockValueService stockValueService;
    private final JwtHelper jwtHelper;

    public StockController(ApiService apiService, JwtTokenProvider jwtTokenProvider,
                           UserService userService, StockValueService stockValueService,
                           JwtHelper jwtHelper) {

        this.apiService = apiService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.stockValueService = stockValueService;
        this.jwtHelper = jwtHelper;
    }

    @Cacheable(cacheNames = "stocks", unless = "#result.statusCodeValue != 200")
    @GetMapping("/stock-data")
    public ResponseEntity<?> stockData(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        Optional<UserEntity> userEntity;
        try {
            userEntity = jwtHelper.getUserFromJwt(token);
        }
        catch (Exception e) {
            if(e.getMessage() == "Missing JWT") {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing JWT");
            }
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unable to verify user identity through JWT");
            }
        }

        Map<String, StockPriceResponse> quoteInfo = null;
        try {
            quoteInfo = apiService.getQuotes(userEntity.get().getFollowedStocks(), "1day");
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching stock information");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("username", userEntity.get().getUsername());
        response.put("quoteInfo", quoteInfo);
        return ResponseEntity.ok(response);
    }

    @CacheEvict(cacheNames = "stocks", key = "#authHeader")
    @PutMapping("/followed-stocks")
    public ResponseEntity<?> followedStocks(@RequestHeader(value = "Authorization", required = false) String authHeader, @RequestBody String symbols) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        Optional<UserEntity> userEntity;
        try {
            userEntity = jwtHelper.getUserFromJwt(token);
        }
        catch (Exception e) {
            if(e.getMessage() == "Missing JWT") {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing JWT");
            }
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unable to verify user identity through JWT");
            }
        }

        if(symbols == null || symbols.isBlank() || !userService.verifyFollowedStocks(symbols)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid stock symbols");
        }

        try {
            userService.updateFollowedStocks(userEntity.get().getId(), symbols);
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unknown error occurred while updating followed stocks");
        }
    }

    @GetMapping("/cron-stock-data")
    public ResponseEntity<?> cronStockData(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        Optional<UserEntity> userEntity;
        try {
            userEntity = jwtHelper.getUserFromJwt(token);
        }
        catch (Exception e) {
            if(e.getMessage() == "Missing JWT") {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing JWT");
            }
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unable to verify user identity through JWT");
            }
        }

        List<StockValueEntity> cronInfo;
        try {
            cronInfo = stockValueService.getAllSavedStockValues();
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching stock information");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("username", userEntity.get().getUsername());
        response.put("quoteInfo", cronInfo);
        return ResponseEntity.ok(response);
    }
}
