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
import { colors } from "../styles/colors";

const StockPerformanceTable = ({stockData}) => {
  const tableHeaders = ["Company Name", "Open", "Close", "Low", "High", "Change", "Change (%)"];
  
  return (
    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, maxWidth: '100vw' }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: colors.secondaryBlue }}>
            {tableHeaders.map((header) => (
              <TableCell key={header} className="stock-performance-header">{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stockData.map((stock, index) => (
            <TableRow key={stock.symbol} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}>
              <TableCell className="stock-performance-data">{stock.name}</TableCell>
              <TableCell className="stock-performance-data">${Number(stock.open).toFixed(2)}</TableCell>
              <TableCell className="stock-performance-data">${Number(stock.close).toFixed(2)}</TableCell>
              <TableCell className="stock-performance-data">${Number(stock.low).toFixed(2)}</TableCell>
              <TableCell className="stock-performance-data">${Number(stock.high).toFixed(2)}</TableCell>
              <TableCell className="stock-performance-data"> {`$${Number(stock.change).toFixed(2)}`.replace('$-', '-$')}</TableCell>
              <TableCell className="stock-performance-data">{Number(stock.percent_change).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StockPerformanceTable