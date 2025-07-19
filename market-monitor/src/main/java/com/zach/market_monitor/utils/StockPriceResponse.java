package com.zach.market_monitor.utils;

public class StockPriceResponse {
    private String average_volume;
    private String change;
    private double close;
    private String currency;
    private String datetime;
    private String exchange;
    private FiftyTwoWeek fifty_two_week;
    private String high;
    private boolean is_market_open;
    private long last_quote_at;
    private String low;
    private String mic_code;
    private String name;
    private String open;
    private String percent_change;
    private String previous_close;
    private String symbol;
    private long timestamp;
    private String volume;

    public String getAverage_volume() {
        return average_volume;
    }

    public void setAverage_volume(String average_volume) {
        this.average_volume = average_volume;
    }

    public String getChange() {
        return change;
    }

    public void setChange(String change) {
        this.change = change;
    }

    public double getClose() {
        return close;
    }

    public void setClose(double close) {
        this.close = close;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDatetime() {
        return datetime;
    }

    public void setDatetime(String datetime) {
        this.datetime = datetime;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public FiftyTwoWeek getFifty_two_week() {
        return fifty_two_week;
    }

    public void setFifty_two_week(FiftyTwoWeek fifty_two_week) {
        this.fifty_two_week = fifty_two_week;
    }

    public String getHigh() {
        return high;
    }

    public void setHigh(String high) {
        this.high = high;
    }

    public boolean isIs_market_open() {
        return is_market_open;
    }

    public void setIs_market_open(boolean is_market_open) {
        this.is_market_open = is_market_open;
    }

    public long getLast_quote_at() {
        return last_quote_at;
    }

    public void setLast_quote_at(long last_quote_at) {
        this.last_quote_at = last_quote_at;
    }

    public String getLow() {
        return low;
    }

    public void setLow(String low) {
        this.low = low;
    }

    public String getMic_code() {
        return mic_code;
    }

    public void setMic_code(String mic_code) {
        this.mic_code = mic_code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOpen() {
        return open;
    }

    public void setOpen(String open) {
        this.open = open;
    }

    public String getPercent_change() {
        return percent_change;
    }

    public void setPercent_change(String percent_change) {
        this.percent_change = percent_change;
    }

    public String getPrevious_close() {
        return previous_close;
    }

    public void setPrevious_close(String previous_close) {
        this.previous_close = previous_close;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getVolume() {
        return volume;
    }

    public void setVolume(String volume) {
        this.volume = volume;
    }

    public static class FiftyTwoWeek {
        private String low;
        private String high;
        private String low_change;
        private String high_change;
        private String low_change_percent;

        private String high_change_percent;

        public String getLow() {
            return low;
        }

        public void setLow(String low) {
            this.low = low;
        }

        public String getHigh() {
            return high;
        }

        public void setHigh(String high) {
            this.high = high;
        }

        public String getLow_change() {
            return low_change;
        }

        public void setLow_change(String low_change) {
            this.low_change = low_change;
        }

        public String getHigh_change() {
            return high_change;
        }

        public void setHigh_change(String high_change) {
            this.high_change = high_change;
        }

        public String getLow_change_percent() {
            return low_change_percent;
        }

        public void setLow_change_percent(String low_change_percent) {
            this.low_change_percent = low_change_percent;
        }

        public String getHigh_change_percent() {
            return high_change_percent;
        }

        public void setHigh_change_percent(String high_change_percent) {
            this.high_change_percent = high_change_percent;
        }
    }
}
