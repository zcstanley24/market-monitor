import React from "react";
import {
  Typography,
  Paper,
  Stack
} from "@mui/material";

const StockTile = (stock) => {
  const {
    symbol,
    name,
    exchange,
    close,
    retrievedPrice,
    percent_change: percentChange,
  } = stock.stockData;

  const isPositive = percentChange >= 0;

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        p: 2,
        width: "100%",
        backgroundColor: "#fff"
      }}
    >
      <Stack mb={1}>
        <Typography variant="h5" fontWeight="bold" color="#2196f3" fontFamily="system-ui">
          {symbol}
        </Typography>
        <Typography variant="body2" color="black" fontSize="1rem" fontFamily="system-ui">
          {name}
        </Typography>
        <Typography variant="body2" color="black" fontFamily="system-ui">
          {exchange}
        </Typography>
      </Stack>

      <Stack>
        <Typography fontFamily="system-ui" fontWeight="500">
          Close: ${close || retrievedPrice}
        </Typography>
        <Typography
          sx={{ color: isPositive ? "success.main" : "error.main", fontFamily: "system-ui", fontWeight:"500" }}
        >
          Change: {(+percentChange).toFixed(2)}%
        </Typography>
      </Stack>
    </Paper>
  );
};

export default StockTile;