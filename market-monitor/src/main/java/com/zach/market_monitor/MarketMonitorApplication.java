package com.zach.market_monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@ComponentScan("com.zach.market_monitor")
public class MarketMonitorApplication {

	public static void main(String[] args) {
		SpringApplication.run(MarketMonitorApplication.class, args);
	}

}
