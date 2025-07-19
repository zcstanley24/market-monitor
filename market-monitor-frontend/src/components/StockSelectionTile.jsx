import React from "react";
import {
  Typography,
  Paper,
  Stack
} from "@mui/material";

const StockTile = ({stock, selectedSymbols, handleStockSelection}) => {
  const {
    name,
    symbol,
    exchange,
    sector,
    industry,
    logo,
  } = stock;

  return (
    <Paper
      elevation={3}
      onClick={() => handleStockSelection(symbol)}
      sx={{
        borderRadius: 2,
        p: 2,
        transition: "all 0.1s ease",
        backgroundColor: selectedSymbols.includes(symbol)
        ? "rgba(46, 125, 50, 0.2)"
        : "#fff",
        cursor: 'pointer',
      ...(selectedSymbols.includes(symbol)
        ? {}
        : {
            '&:hover': {
              backgroundColor: '#e2e8f0 !important',
              boxShadow: 6,
            },
          }),
      }}
    >
      <Stack mb={1} sx={{alignItems: 'center'}}>
        <img src={logo} style={{ height: '30px' }} />
        <Typography variant="h5" fontWeight="bold" color="#2196f3" fontFamily="system-ui">
          {symbol}
        </Typography>
        <Typography variant="body2" fontWeight="500" color="black" fontSize="1rem" fontFamily="system-ui">
          {name}
        </Typography>
        <Typography variant="body2" color="black" fontFamily="system-ui">
          {exchange}
        </Typography>
        <Typography variant="body2" color="black" fontFamily="system-ui">
          {sector}
        </Typography>
        <Typography variant="body2" color="black" fontFamily="system-ui">
          {industry}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default StockTile;