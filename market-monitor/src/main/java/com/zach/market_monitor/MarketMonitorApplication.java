package com.zach.market_monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.zach.market_monitor.repositories")
@EntityScan("com.zach.market_monitor.models") // or your package
@EnableCaching
@EnableScheduling
public class MarketMonitorApplication {

	public static void main(String[] args) {
		SpringApplication.run(MarketMonitorApplication.class, args);
	}

}
