package com.zach.market_monitor.utils;

import com.zach.market_monitor.services.ApiService;
import com.zach.market_monitor.services.StockValueService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class StockCron {

    private final ApiService apiService;
    private final StockValueService stockValueService;

    public StockCron(ApiService apiService, StockValueService stockValueService) {
        this.apiService = apiService;
        this.stockValueService = stockValueService;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void fetchPriceForPredefinedStocks() {
        List<String> targetedSymbols = List.of("AMZN", "AAPL", "GOOG");
        List<String> targetedNames = List.of("Amazon.com, Inc.", "Apple, Inc.", "Alphabet, Inc.");
        for (int i = 0; i < targetedSymbols.size(); i++) {
            String symbol = targetedSymbols.get(i);
            StockPriceResponse stockPriceResponse = apiService.getQuote(symbol, "1day");
            stockValueService.createStockValue(symbol, targetedNames.get(i), stockPriceResponse.getClose(), stockPriceResponse);
        }
    }
}
