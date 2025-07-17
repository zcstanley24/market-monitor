import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
  Stack,
  Link,
  Grid,
} from '@mui/material';
import MainToolbar from "../components/MainToolbar.jsx";
import StockTile from '../components/StockTile.jsx';
import FiftyTwoWeekRangeChart from '../components/FiftyTwoWeekRangeChart.jsx';
import StockPerformanceTable from "../components/StockPerformanceTable.jsx";
import VolumeChart from "../components/VolumeChart.jsx";
import '../styles/App.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowedModalLoading, setIsFollowedModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [followedModalError, setFollowedModalError] = useState("");
  const [username, setUsername] = useState("");
  const options = [
    { name: "NVIDIA", symbol: "NVDA"},
    { name: "Microsoft", symbol: "MSFT"},
    { name: "AT&T", symbol: "T"},
    { name: "T-Mobile", symbol: "TMUS"},
    { name: "Verizon", symbol: "VZ"},
    { name: "Meta", symbol: "META"},
    { name: "Broadcom", symbol: "AVGO"},
    { name: "Target", symbol: "TGT"},
    { name: "Tesla", symbol: "TSLA"},
    { name: "JPMorgan Chase", symbol: "JPM"},
    { name: "Walmart", symbol: "WMT"},
    { name: "Eli Lilly", symbol: "LLY"},
    { name: "Visa", symbol: "V"},
    { name: "Oracle", symbol: "ORCL"},
    { name: "Netflix", symbol: "NFLX"},
    { name: "Mastercard", symbol: "MA"},
    { name: "Exxon Mobil", symbol: "XOM"},
    { name: "Costco", symbol: "COST"},
    { name: "Johnson & Johnson", symbol: "JNJ"},
    { name: "Home Depot", symbol: "HD"}
  ];
  
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
          window.location.href = '/login';
        }
        else if(!res.ok) {
          throw new Error("Failed to fetch stock data");
        }
        return res.json();
      })
      .then((data) => {
        if(data?.quoteInfo?.code == 429) {
          setError("Maximum API calls exceeded. Please try again in a minute.");
        }
        else if(data?.quoteInfo?.code?.toString().startsWith("4") || data?.quoteInfo?.code?.toString().startsWith("5")) {
          setError("Failed to fetch stock data");
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
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleFollowedDropdownChange = (e) => {
    const newValues = e.target.value;

    if(newValues.length <= 3) {
      setFollowedModalError("");
    }
    else {
      setFollowedModalError("Please select less than or equal to 3 stocks");
    }
    setSelectedSymbols(newValues);
  }

  const handleEditSelectedStocks = () => {
    if(selectedSymbols.length > 3) { return };
    setIsFollowedModalLoading(true);

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
          window.location.href = '/login';
        }
        else if(!res.ok) {
          throw new Error("Failed to update followed stocks");
        }
        return;
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        setFollowedModalError(err.message);
        setIsFollowedModalLoading(false);
      });
  };

  return (
    <Grid container className="dashboard" flexDirection="column">
      <MainToolbar currentPage="dashboard" username={username}/>
      <Grid>
        <Box className="dashboard-content">
          <Stack spacing={2}>
            <Stack direction="row" align="center" mb={2} spacing={2}>
              <Typography size="lg" mb={0} color="black">
                My Followed Stocks
              </Typography>
              <Link fontSize="sm" onClick={() => setIsEditModalOpen(true)}>
                Edit
              </Link>
              <Modal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
              >
                <Box className="followed-modal">
                  <Typography id="modal-title" variant="h6" component="h2">
                    Edit Followed Stocks
                  </Typography>
                  <Typography id="modal-description" sx={{ mt: 2, mb: 2 }}>
                    Please select your top 3 stocks from the dropdown below
                  </Typography>
                  {followedModalError && (
                    <Typography color="red" mb={2}>
                      {followedModalError}
                    </Typography>
                  )}
                  <FormControl fullWidth>
                    <InputLabel id="array-dropdown-label">Choose up to 3 stocks</InputLabel>
                    <Select
                      labelId="array-dropdown-label"
                      id="array-dropdown"
                      multiple
                      value={selectedSymbols}
                      onChange={handleFollowedDropdownChange}
                      renderValue={(selected) => selected.join(", ")}
                      label="Choose up to 3 options"
                    >
                      {options.map((option) => (
                        <MenuItem key={option.name} value={option.symbol}>
                          <Checkbox checked={selectedSymbols.includes(option.symbol)} />
                          <ListItemText primary={option.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box className="followed-modal-buttons">
                    <Button onClick={() => setIsEditModalOpen(false)} sx={{ mt: 3 }} variant="outlined">
                      Close
                    </Button>
                    <Button onClick={() => handleEditSelectedStocks()} sx={{ mt: 3 }} variant="outlined">
                      {isFollowedModalLoading ? <CircularProgress size="20px"/> : "Submit" }
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Stack>
            {isLoading && (
              <div>
                Loading...
              </div>
            )}
            <Stack direction="row">
              <Box>
                <Stack direction="row" spacing={4}>
                  {!isLoading && stockData.length && stockData.map((stock) => (
                    <StockTile key={stock.symbol} stockData={stock} />
                  ))}
                </Stack>
                {error && (
                  <Typography color="red">
                    {error}
                  </Typography>
                )}
                <FiftyTwoWeekRangeChart stockData={stockData} />
              </Box>
              <Stack>
                <StockPerformanceTable stockData={stockData} />
                <VolumeChart stockData={stockData} />
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Grid>
    </Grid>);
}

export default Dashboard