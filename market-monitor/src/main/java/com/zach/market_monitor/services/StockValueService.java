package com.zach.market_monitor.services;

import com.zach.market_monitor.models.StockValueEntity;
import com.zach.market_monitor.repositories.StockValueRepository;
import com.zach.market_monitor.utils.StockPriceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class StockValueService {

    private final StockValueRepository stockValueRepository;

    @Autowired
    public StockValueService(StockValueRepository stockValueRepository) {
        this.stockValueRepository = stockValueRepository;
    }

    public Optional<StockValueEntity> getStockValueBySymbol(String symbol) {
        return stockValueRepository.findBySymbol(symbol);
    }

    public StockValueEntity createStockValue(String symbol, String name, Double retrievedPrice, StockPriceResponse stockPriceResponse) {
        List<StockValueEntity> matchingEntries = stockValueRepository.findByNameOrderByRetrievalTimeDesc(name);

        if (!matchingEntries.isEmpty()) {
            if (matchingEntries.size() > 6) {
                List<StockValueEntity> toDelete = matchingEntries.subList(6, matchingEntries.size());
                stockValueRepository.deleteAll(toDelete);
            }
            StockValueEntity latest = matchingEntries.get(0);
            if (latest.getRetrievedPrice().equals(retrievedPrice)) {
                return latest;
            }
        }

        StockValueEntity newEntry = new StockValueEntity(symbol, name, retrievedPrice, new Date(), stockPriceResponse);
        return stockValueRepository.save(newEntry);
    }

    public List<StockValueEntity> getAllSavedStockValues() {
        Sort sort = Sort.by(Sort.Order.desc("retrievalTime"), Sort.Order.asc("name"));
        return stockValueRepository.findAll(sort);
    }
}
