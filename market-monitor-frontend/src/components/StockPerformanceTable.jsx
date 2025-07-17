import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const StockPerformanceTable = ({stockData}) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="stock data table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell align="right"><strong>Open</strong></TableCell>
            <TableCell align="right"><strong>Close</strong></TableCell>
            <TableCell align="right"><strong>Change</strong></TableCell>
            <TableCell align="right"><strong>Change (%)</strong></TableCell>
            <TableCell align="right"><strong>Low</strong></TableCell>
            <TableCell align="right"><strong>High</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stockData.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell>{stock.name}</TableCell>
              <TableCell align="right">${Number(stock.open).toFixed(2)}</TableCell>
              <TableCell align="right">${Number(stock.close).toFixed(2)}</TableCell>
              <TableCell align="right"> {`$${Number(stock.change).toFixed(2)}`.replace('$-', '-$')}</TableCell>
              <TableCell
                align="right"
                style={{ color: stock.percent_change >= 0 ? 'green' : 'red' }}
              >
                {Number(stock.percent_change).toFixed(2)}%
              </TableCell>
              <TableCell align="right">${Number(stock.low).toFixed(2)}</TableCell>
              <TableCell align="right">${Number(stock.high).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockPerformanceTable