import React from "react";
import {
  Typography,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const StockTile = (stock) => {
  const theme = useTheme();
  const isSmallerScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallestScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
        backgroundColor: "#fff",
        transition: "all 0.3s ease",
        '&:hover': {
          backgroundColor: '#f5f5f5',
          boxShadow: 6,
        },
      }}
      style={{width: isSmallestScreen ? "100%" : isSmallerScreen ? "42.445%" : "27.645%"}}
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