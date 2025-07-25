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
import { colors } from '../styles/colors.js';
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
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  
  useEffect(() => {
    fetch(`${backendUrl}/stock-data`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("marketMonitorToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if([401, 403].includes(res.status)) {
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

    fetch(`${backendUrl}/followed-stocks`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("marketMonitorToken")}`,
        "Content-Type": "application/json",
      },
      body: selectedSymbols.join(","),
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
        setError("Please select only 3 stocks. You can click to deselect any of your current choices.");
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
        <Box className="error-modal" width={isSmallScreen ? 200 : 400}>
          <Box>
            <Typography variant="h4" fontFamily="system-ui">
              Oops!
            </Typography>
            <Typography mt="1.5rem" fontFamily="system-ui">
              {error}
            </Typography>
          </Box>
          <Box mt="1.5rem">
            <Button className="error-modal-button" onClick={() => handleErrorModalClose()} style={{borderColor: colors.secondaryBlue}} variant="outlined">
              <Typography color={colors.secondaryBlue}>
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
        <Typography display={isMediumScreen ? '' : 'none'} fontFamily="system-ui" fontSize="20px" color="black" fontWeight="500">
          Please select 3 stocks to display on your dashboard
        </Typography>
        <Stack direction="row" alignItems="center" mb={2} spacing={4} justifyContent="space-between" sx={{flexGrow: 1, width: '100%'}}>
          <Button onClick={() => setSelectedSymbols([])} variant="contained" sx={{
            px: 2,
            py: 1,
            backgroundColor: colors.secondaryBlue,
            color: "white",
            fontWeight: 500,
            fontSize: '18px',
            fontFamily: 'system-ui',
            textTransform: "none",
            boxShadow: 2,
            '&:hover': {
              backgroundColor: '#1E8882',
              boxShadow: 4,
            },
            borderRadius: 2,
            flexShrink: 0,
            alignSelf: 'center'
          }}>
            Clear All
          </Button>
          <Typography display={isMediumScreen ? 'none' : ''} fontFamily="system-ui" fontSize="20px" color="black" fontWeight="500">
            Please select 3 stocks to display on your dashboard
          </Typography>
          <Button onClick={() => handleEditSelectedStocks()} variant="contained" sx={{
            px: 2,
            py: 1,
            backgroundColor: colors.secondaryBlue,
            color: "white",
            fontWeight: 500,
            fontSize: '18px',
            fontFamily: 'system-ui',
            textTransform: "none",
            boxShadow: 2,
            '&:hover': {
              backgroundColor: '#1E8882',
              boxShadow: 4,
            },
            borderRadius: 2,
            flexShrink: 0,
            alignSelf: 'center'
          }}>
              {isSubmitting ? <CircularProgress size="20px"/> : "Submit" }
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