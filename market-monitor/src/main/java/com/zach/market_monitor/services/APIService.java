package com.zach.market_monitor.services;

import com.zach.market_monitor.utils.StockPriceResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Arrays;

@Service
public class APIService {
    @Value("${twelve.apikey}")
    private String twelveApiKey;
    private WebClient webClient;

    @PostConstruct
    public void init() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.twelvedata.com/")
                .defaultHeader("Authorization", "apikey " + twelveApiKey)
                .build();
    }

    public StockPriceResponse getCurrentPrice(String stockSymbol) {
        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/price")
                            .queryParam("symbol", stockSymbol)
                            .build())
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse
                                    .createException()
                                    .flatMap(Mono::error)
                    )
                    .bodyToMono(StockPriceResponse.class) // FIXED
                    .block();
        } catch (WebClientResponseException e) {
            System.err.println("HTTP Status: " + e.getRawStatusCode() + ", Body: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            System.err.println("Request failed: " + e.getMessage());
            throw new RuntimeException("Failed to get quote for " + stockSymbol, e);
        }
    }

    public String getQuote(String stockSymbol, String interval) {
        String[] intervals = {"1min", "5min", "15min", "30min", "45min", "1h", "2h", "4h", "1day", "1week", "1month"};
        String requestInterval = (!Arrays.asList(intervals).contains(interval)) ? "1day" : interval;

        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/quote")
                            .queryParam("symbol", stockSymbol)
                            .queryParam("interval", requestInterval)
                            .build())
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError() || status.is5xxServerError(),
                            clientResponse -> clientResponse
                                    .createException()
                                    .flatMap(Mono::error)
                    )
                    .bodyToMono(String.class)
                    .block();
        } catch (WebClientResponseException e) {
            System.err.println("HTTP Status: " + e.getRawStatusCode() + ", Body: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            System.err.println("Request failed: " + e.getMessage());
            throw new RuntimeException("Failed to get quote for " + stockSymbol, e);
        }
    }
}
