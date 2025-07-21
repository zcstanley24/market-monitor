import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
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
import MainToolbar from "../components/MainToolbar.jsx";
import StockSelectionTile from '../components/StockSelectionTile.jsx';
import options from '../data/stockData.js';
import '../styles/App.css';
import '../styles/Dashboard.css';

const PickMyStocks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  
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
        setSelectedSymbols(Object.values(quoteData).map(item => item.symbol));
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

  const handleEditSelectedStocks = () => {
    if(selectedSymbols.length != 3) { 
      setError("Please select 3 stocks."); 
      setIsErrorModalOpen(true);
      return;
    };
    setIsSubmitting(true);

    fetch("http://localhost:8080/followed-stocks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: selectedSymbols.join(","),
      credentials: "include"
    })
      .then((res) => {
        if(res.status === 403) {
          navigate("/login");
        }
        else if(!res.ok) {
          throw new Error("Failed to update followed stocks");
        }
        return;
      })
      .then(() => {
        setIsSubmitting(false);
        navigate("/", { state: { toastMessage: 'Your stocks were updated successfully!' } });
      })
      .catch((err) => {
        if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
          setError("Unable to connect to the server. Please check your internet or try again later.");
        }
        else {
          setError(err.message);
        }
        setIsSubmitting(false);
        setIsErrorModalOpen(true);
      });
  };

  const handleErrorModalClose = () => {
    setError("");
    setIsErrorModalOpen(false);
  };

  const handleStockSelection = (symbol) => {
    if(selectedSymbols.includes(symbol)) {
      setSelectedSymbols(previous => previous.filter(stock => stock !== symbol))
    }
    else {
      if(selectedSymbols.length > 2) {
        setError("Please select only 3 stocks.");
        setIsErrorModalOpen(true);
      }
      else {
        setSelectedSymbols(previous => [...previous, symbol]);
      }
    }
  };

  return (
    <Stack className="pick-my-stocks" sx={{alignItems: 'center'}}>
      <MainToolbar currentPage="pick-my-stocks" username={username}/>
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
            <Button className="error-modal-button" onClick={() => handleErrorModalClose()} sx={{borderColor: "#2E7D32"}} variant="outlined">
              <Typography color="#2E7D32">
                Close
              </Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
      {isLoading && (
        <Box className="dashboard-content" spacing={3} mt={6} mb={6}>
          <CircularProgress size={100} />
        </Box>
      )}
      {!isLoading && (<Stack className="dashboard-content" spacing={3} mt={6} mb={6} width="70%" sx={{display: 'flex', alignItems: 'center'}}>
        <Stack direction="row" align="center" mb={2} spacing={4} justifyContent="space-between">
          <Button style={{padding: isSmallScreen ? "0" : "20px"}} onClick={() => setSelectedSymbols([])} sx={{borderColor: "#2196f3"}} variant="outlined">
            <Typography color="#2196f3">
              Clear All
            </Typography>
          </Button>
          <Typography fontFamily="system-ui" fontSize="20px" color="black">
            Please select 3 stocks to display on your dashboard
          </Typography>
          <Button onClick={() => handleEditSelectedStocks()} sx={{borderColor: "#2196f3"}} variant="outlined">
            <Typography color="#2196f3">
              {isSubmitting ? <CircularProgress size="20px"/> : "Submit" }
            </Typography>
          </Button>
        </Stack>
        <Stack direction="row">
          <Grid container spacing={4}>
            {options.map((stock) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={stock.symbol}>
                <StockSelectionTile key={stock.symbol} 
                  stock={stock} selectedSymbols={selectedSymbols} 
                  handleStockSelection={handleStockSelection}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>)}
    </Stack>
  );
}

export default PickMyStocks