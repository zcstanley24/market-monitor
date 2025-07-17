package com.zach.market_monitor.utils;

import com.zach.market_monitor.services.APIService;
import com.zach.market_monitor.services.StockValueService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class StockCron {

    private final APIService apiService;
    private final StockValueService stockValueService;

    public StockCron(APIService apiService, StockValueService stockValueService) {
        this.apiService = apiService;
        this.stockValueService = stockValueService;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void fetchPriceForPredefinedStocks() {
        List<String> targetedSymbols = List.of("AAPL", "GOOG", "AMZN");
        List<String> targetedNames = List.of("Apple", "Google", "Amazon");
        for (int i = 0; i < targetedSymbols.size(); i++) {
            String symbol = targetedSymbols.get(i);
            StockPriceResponse stockPriceResponse = apiService.getQuote(symbol, "1day");
            stockValueService.createStockValue(symbol, targetedNames.get(i), stockPriceResponse.getClose(), stockPriceResponse);
        }
    }
}
