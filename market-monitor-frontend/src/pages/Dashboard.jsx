import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  Box,
  Stack,
  CircularProgress,
  Modal,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MainToolbar from "../components/MainToolbar.jsx";
import StockTile from '../components/StockTile.jsx';
import FiftyTwoWeekRangeChart from '../components/FiftyTwoWeekRangeChart.jsx';
import StockPerformanceTable from "../components/StockPerformanceTable.jsx";
import VolumeChart from "../components/VolumeChart.jsx";
import { toast } from 'react-toastify';
import '../styles/App.css';
import '../styles/Dashboard.css';
import { colors } from '../styles/colors.js';

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
    }
    window.history.replaceState({}, document.title);
  }, [location.state]);
  
  useEffect(() => {
    fetch("http://localhost:8080/stock-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => {
        if(res.status === 403) {
          navigate('/login');
        }
        else if(!res.ok) {
          throw new Error("Failed to fetch stock data. Please try again later.");
        }
        return res.json();
      })
      .then((data) => {
        if(data?.quoteInfo?.code == 429) {
          throw new Error("Maximum API calls exceeded. Please try again in one minute.");
        }
        else if(data?.quoteInfo?.code?.toString().startsWith("4") || data?.quoteInfo?.code?.toString().startsWith("5")) {
          throw new Error("Failed to fetch stock data. Please try again later.");
        }
        setUsername(data?.username);
        const quoteData = data?.quoteInfo;
        const mappedBarChartData = Object.values(quoteData).map(item => ({
          ...item,
          close: Number(Number(item.close).toFixed(2)),
          fifty_two_week_low: Number(item.fifty_two_week?.low).toFixed(2),
          fifty_two_week_high: Number(item.fifty_two_week?.high).toFixed(2),
          fifty_two_week_range: [Number((Number(item.close) - Number(item.fifty_two_week?.low)).toFixed(2)), Number((Number(item.fifty_two_week?.high) - Number(item.close)).toFixed(2))],
          relative_volatility: Number(
            Math.abs(item.volume - item.average_volume) / item.average_volume
          ).toFixed(2)
        }));
        setStockData(mappedBarChartData);
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
      <MainToolbar currentPage="dashboard" username={username}/>
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
              {stockData.map((stock) => (
                <StockTile key={stock.symbol} stockData={stock} />
              ))}
            </Stack>
            <FiftyTwoWeekRangeChart stockData={stockData} />
          </Stack>
          <Stack gap={4} width={isSmallScreen ? "95%" : 750}>
            <StockPerformanceTable stockData={stockData} />
            <VolumeChart stockData={stockData} />
          </Stack>
        </Stack>)}
      </Box>
    </Stack>);
}

export default Dashboard