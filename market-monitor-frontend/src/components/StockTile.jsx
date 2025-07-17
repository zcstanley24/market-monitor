import React, { useState } from "react";

const StockTile = (stock) => {
  const {
    symbol,
    name,
    open,
    close,
    retrievedPrice,
    percent_change: percentChange,
    low,
    high
  } = stock.stockData;

  const isPositive = percentChange >= 0;

  return (
    <div style={styles.tile}>
      <div style={styles.header}>
        <div style={styles.symbol}>{symbol}</div>
        <div style={styles.name}>{name}</div>
      </div>
      <div style={styles.details}>
        <div><strong>Open:</strong> ${open}</div>
        <div><strong>Close:</strong> ${close || retrievedPrice}</div>
        <div style={{ color: isPositive ? "green" : "red" }}>
          <strong>Change:</strong> {(+percentChange).toFixed(2)}%
        </div>
        <div><strong>Low:</strong> ${low}</div>
        <div><strong>High:</strong> ${high}</div>
      </div>
    </div>
  );
};

const styles = {
  tile: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    width: "250px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
    margin: "8px"
  },
  header: {
    marginBottom: "12px"
  },
  symbol: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1a202c"
  },
  name: {
    fontSize: "14px",
    color: "#718096"
  },
  details: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#718096"
  }
};

export default StockTile;