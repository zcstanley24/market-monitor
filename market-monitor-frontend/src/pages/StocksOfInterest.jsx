import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Button,
  Box,
  CircularProgress,
  Stack,
  Grid,
} from '@mui/material';
import StockTile from '../components/StockTile.jsx';
import MainToolbar from "../components/MainToolbar.jsx";
import SevenDayTimeSeries from "../components/SevenDayTimeSeries.jsx";
import SevenDayVariationChart from "../components/SevenDayVariationChart.jsx";
import StockPerformanceTable from "../components/StockPerformanceTable.jsx";
import '../styles/App.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [cronStockChartTimeSeriesData, setCronStockChartTimeSeriesData] = useState([]);
  const [cronStockChartRangeData, setCronStockChartRangeData] = useState([]);
  const [cronStockData, setCronStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/cron-stock-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => {
        if(res.status === 403) {
          window.location.href = '/login';
        }
        else if(!res.ok) {
          throw new Error("Failed to fetch stock data");
        }
        return res.json();
      })
      .then((data) => {
        setUsername(data?.username);
        const quoteInfo = data?.quoteInfo;
        const mappedQuoteData = Object.values(quoteInfo).map(item => ({
          ...item,
          close: item.retrievedPrice,
        }));
        const stockTileData = mappedQuoteData.slice(0,3).sort((a, b) => a.symbol.localeCompare(b.symbol));

        const groupedTimeSeries = {};
        const groupedRange = {};

        quoteInfo.forEach(({ name, symbol, retrievedPrice, retrievalTime, low, high }) => {
          const date = retrievalTime.slice(0, 10); 
          if (!groupedTimeSeries[date]) {
            groupedTimeSeries[date] = { retrievalTime: date };
          }

          if (!groupedRange[date]) {
            groupedRange[date] = { retrievalTime: date };
          }

          groupedTimeSeries[date][`${name} (${symbol})`] = retrievedPrice;
          groupedRange[date][`${name} (${symbol})`] = high - low;
        });
        const timeSeriesData = Object.values(groupedTimeSeries).sort(
          (a, b) => new Date(a.retrievalTime) - new Date(b.retrievalTime)
        );
        const rangeData = Object.values(groupedRange).sort(
          (a, b) => new Date(a.retrievalTime) - new Date(b.retrievalTime)
        );
        setCronStockChartTimeSeriesData(timeSeriesData);
        setCronStockChartRangeData(rangeData);
        setCronStockData(stockTileData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <Stack className="dashboard">
      <MainToolbar currentPage="stocks-of-interest" username={username}/>
      <Modal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      >
        <Box className="error-modal" width={400}>
          <Box>
            <Typography variant="h4" fontFamily="system-ui">
              Oops!
            </Typography>
            <Typography mt="1.5rem" fontFamily="system-ui">
              {error}
            </Typography>
          </Box>
          <Box mt="1.5rem">
            <Button className="error-modal-button" onClick={() => setIsErrorModalOpen(false)} sx={{borderColor: "#2E7D32"}} variant="outlined">
              <Typography color="#2E7D32">
                Close
              </Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
      <Grid container className="dashboard-content">
        {isLoading && (
          <CircularProgress size={100} />
        )}
        {!isLoading && (<Stack direction="row" gap={4}>
          <Stack gap={4} width={800}>
            <Stack direction="row" gap={2}>
              {cronStockData.map((stock) => (
                <StockTile key={stock.symbol} stockData={stock} />
              ))}
            </Stack>
            <SevenDayTimeSeries data={cronStockChartTimeSeriesData}/>
          </Stack>
          <Stack gap={4} width={800}>
            <StockPerformanceTable stockData={cronStockData} />
            <SevenDayVariationChart data={cronStockChartRangeData} />
          </Stack>
        </Stack>)}
      </Grid>
    </Stack>);
}

export default Dashboard