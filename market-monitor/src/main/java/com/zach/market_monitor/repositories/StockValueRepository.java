package com.zach.market_monitor.repositories;

import com.zach.market_monitor.models.StockValueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockValueRepository extends JpaRepository<StockValueEntity, Long> {
    Optional<StockValueEntity> findBySymbol(String symbol);
    List<StockValueEntity> findByNameOrderByRetrievalTimeDesc(String name);
}
