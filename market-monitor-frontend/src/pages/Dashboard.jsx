import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  Box,
  Stack,
  CircularProgress,
  Modal,
  Button,
} from '@mui/material';
import MainToolbar from "../components/MainToolbar.jsx";
import StockTile from '../components/StockTile.jsx';
import FiftyTwoWeekRangeChart from '../components/FiftyTwoWeekRangeChart.jsx';
import StockPerformanceTable from "../components/StockPerformanceTable.jsx";
import VolumeChart from "../components/VolumeChart.jsx";
import { toast } from 'react-toastify';
import '../styles/App.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
            <Button className="error-modal-button" onClick={() => setIsErrorModalOpen(false)} sx={{borderColor: "#2E7D32"}} variant="outlined">
              <Typography color="#2E7D32">
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
        {!isLoading && (<Stack direction="row" gap={4}>
          <Stack gap={4} width={800}>
            <Stack direction="row" gap={2}>
              {stockData.map((stock) => (
                <StockTile key={stock.symbol} stockData={stock} />
              ))}
            </Stack>
            <FiftyTwoWeekRangeChart stockData={stockData} />
          </Stack>
          <Stack gap={4}>
            <StockPerformanceTable stockData={stockData} />
            <VolumeChart stockData={stockData} />
          </Stack>
        </Stack>)}
      </Box>
    </Stack>);
}

export default Dashboard