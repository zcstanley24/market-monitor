package com.zach.market_monitor.controllers;

import com.zach.market_monitor.services.APIService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StockController {
    private final APIService apiService;

    public StockController(APIService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/test")
    public String test() {
        return "Hello, world!";
    }

    @GetMapping("/price2")
    public String price2(@RequestParam(defaultValue = "AAPL") String symbol) {
        return apiService.getCurrentPrice(symbol);
    }

    @GetMapping("/quote")
    public String quote(@RequestParam(defaultValue = "AAPL") String symbol, @RequestParam(defaultValue = "1day") String interval) {
        return apiService.getQuote(symbol, interval);
    }


}
