package com.zach.market_monitor.models;

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

    public StockValueEntity() {}

    public StockValueEntity(String symbol, String name, Double retrievedPrice, Date retrievalTime) {
        this.symbol = symbol;
        this.name = name;
        this.retrievedPrice = retrievedPrice;
        this.retrievalTime = retrievalTime;
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

