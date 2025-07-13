package com.zach.market_monitor.services;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class APIService {
    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.twelvedata.com/")
            .defaultHeader("Authorization", "apikey 98ae839017c04dffb5070af584ce6205")
            .build();

    public String getCurrentPrice(String stockSymbol) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/price")
                        .queryParam("symbol", stockSymbol)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getQuote(String stockSymbol, String interval) {
        String[] intervals = {"1min", "5min", "15min", "30min", "45min", "1h", "2h", "4h", "1day", "1week", "1month"};
        String requestInterval = (!Arrays.asList(intervals).contains(interval)) ? "1day" : interval;

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/quote")
                        .queryParam("symbol", stockSymbol)
                        .queryParam("interval", requestInterval)
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
