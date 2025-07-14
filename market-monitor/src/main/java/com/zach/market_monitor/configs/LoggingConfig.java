package com.zach.market_monitor.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@Configuration
public class LoggingConfig {

    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter() {
        CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
        filter.setIncludeClientInfo(true);  // Log client IP
        filter.setIncludeQueryString(true);  // Log query parameters
        filter.setIncludeHeaders(true);  // Log request headers
        filter.setIncludePayload(true);  // Log request body (be cautious with sensitive data)
        filter.setAfterMessagePrefix("REQUEST DATA: ");  // Prefix for logged request data
        return filter;
    }
}
