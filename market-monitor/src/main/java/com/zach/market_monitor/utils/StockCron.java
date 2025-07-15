package com.zach.market_monitor.utils;

import com.zach.market_monitor.services.APIService;
import com.zach.market_monitor.services.StockValueService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
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
        List<String> targetedSymbols = List.of("T", "VZ", "TMUS");
        List<String> targetedNames = List.of("AT&T", "Verizon", "T-Mobile");
        for (int i = 0; i < targetedSymbols.size(); i++) {
            String symbol = targetedSymbols.get(i);
            StockPriceResponse stockPriceResponse = apiService.getCurrentPrice(symbol);
            stockValueService.createStockValue(symbol, targetedNames.get(i), Double.parseDouble(stockPriceResponse.getPrice()));
        }
    }
}
