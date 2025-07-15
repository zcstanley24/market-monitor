package com.zach.market_monitor.security;

import java.util.Set;

public class UserSignupRequest {
    private String username;
    private String password;

    private String followedStocks;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFollowedStocks() {
        return followedStocks;
    }

    public void setFollowedStocks(String followedStocks) {
        this.followedStocks = followedStocks;
    }
}
