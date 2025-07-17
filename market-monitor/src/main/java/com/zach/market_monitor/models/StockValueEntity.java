package com.zach.market_monitor.models;

import com.zach.market_monitor.utils.StockPriceResponse;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class StockValueEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;
    private String name;
    private Double retrievedPrice;
    private Date retrievalTime;

    private Double low;
    private Double high;
    private Double open;
    private Double percent_change;

    public StockValueEntity() {}

    public StockValueEntity(String symbol, String name, Double retrievedPrice, Date retrievalTime, StockPriceResponse stockPriceInfo) {
        this.symbol = symbol;
        this.name = name;
        this.retrievedPrice = retrievedPrice;
        this.retrievalTime = retrievalTime;
        this.low = Double.parseDouble(stockPriceInfo.getLow());
        this.high = Double.parseDouble(stockPriceInfo.getHigh());
        this.open = Double.parseDouble(stockPriceInfo.getOpen());
        this.percent_change = Double.parseDouble(stockPriceInfo.getPercent_change());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLow() {
        return low;
    }

    public void setLow(double low) {
        this.low = low;
    }

    public double getHigh() {
        return high;
    }

    public void setHigh(double high) {
        this.high = high;
    }

    public double getOpen() {
        return open;
    }

    public void setOpen(double open) {
        this.open = open;
    }

    public double getPercent_change() {
        return percent_change;
    }

    public void setPercent_change(double change) {
        this.percent_change = change;
    }

    public Double getRetrievedPrice() {
        return retrievedPrice;
    }

    public void setRetrievedPrice(Double retrievedPrice) {
        this.retrievedPrice = retrievedPrice;
    }

    public Date getRetrievalTime() {
        return retrievalTime;
    }

    public void setRetrievalTime(Date retrievalTime) {
        this.retrievalTime = retrievalTime;
    }
}

