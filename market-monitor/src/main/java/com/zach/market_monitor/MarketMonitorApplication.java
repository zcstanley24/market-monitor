package com.zach.market_monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

//@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@SpringBootApplication
//@ComponentScan("com.zach.market_monitor")
@EnableJpaRepositories(basePackages = "com.zach.market_monitor.repositories")
@EntityScan("com.zach.market_monitor.models") // or your package
public class MarketMonitorApplication {

	public static void main(String[] args) {
		SpringApplication.run(MarketMonitorApplication.class, args);
	}

}
