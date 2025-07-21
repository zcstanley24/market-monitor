import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Button,
  Box,
  CircularProgress,
  Stack,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StockTile from '../components/StockTile.jsx';
import MainToolbar from "../components/MainToolbar.jsx";
import SevenDayTimeSeries from "../components/SevenDayTimeSeries.jsx";
import SevenDayVariationChart from "../components/SevenDayVariationChart.jsx";
import StockPerformanceTable from "../components/StockPerformanceTable.jsx";
import '../styles/App.css';
import '../styles/Dashboard.css';
import { colors } from '../styles/colors.js';

const Dashboard = () => {
  const [cronStockChartTimeSeriesData, setCronStockChartTimeSeriesData] = useState([]);
  const [cronStockChartRangeData, setCronStockChartRangeData] = useState([]);
  const [cronStockData, setCronStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

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
        if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
          setError("Unable to connect to the server. Please check your internet or try again later.");
        }
        else {
          setError(err.message);
        }
        setFailedToLoad(true);
        setIsLoading(false);
        setIsErrorModalOpen(true);
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
            <Button className="error-modal-button" onClick={() => setIsErrorModalOpen(false)} style={{borderColor: colors.secondaryBlue}} variant="outlined">
              <Typography color={colors.secondaryBlue}>
                Close
              </Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
      <Box className="dashboard-content">
        {isLoading && (
          <CircularProgress size={100} />
        )}
        {failedToLoad && (
          <Stack sx={{alignItems: 'center'}}>
            <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 100 }} />
            <Typography sx={{fontFamily: "system-ui", fontSize: '40px', color: 'error.main'}}>No data found</Typography>
          </Stack>
        )}
        {!isLoading && !failedToLoad && (<Stack direction={isSmallScreen ? "column" : "row"} gap={4} flexWrap="wrap" sx={{justifyContent: 'center', margin: '5rem 0rem 5rem 1rem'}}>
          <Stack gap={4} width={isSmallScreen ? "95%" : 750}>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {cronStockData.map((stock) => (
                <StockTile key={stock.symbol} stockData={stock} />
              ))}
            </Stack>
            <SevenDayTimeSeries data={cronStockChartTimeSeriesData}/>
          </Stack>
          <Stack gap={4} width={isSmallScreen ? "95%" : 750}>
            <StockPerformanceTable stockData={cronStockData} />
            <SevenDayVariationChart data={cronStockChartRangeData} />
          </Stack>
        </Stack>)}
      </Box>
    </Stack>);
}

export default Dashboard