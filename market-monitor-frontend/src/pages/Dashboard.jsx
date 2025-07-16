import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Modal,
  Typography,
  Button,
  Box as MuiBox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Link,
  Heading,
} from '@chakra-ui/react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart,
  Bar, ErrorBar,
} from "recharts";
import StockTile from '../components/StockTile.jsx';
import '../styles/App.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [cronStockData, setCronStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowedModalLoading, setIsFollowedModalLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [followedModalError, setFollowedModalError] = useState("");
  const options = [
    { name: "NVIDIA", symbol: "NVDA"},
    { name: "Microsoft", symbol: "MSFT"},
    { name: "Google", symbol: "GOOG"},
    { name: "Apple", symbol: "AAPL"},
    { name: "Amazon", symbol: "AMZN"},
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
        if(data?.code == 429) {
          setError("Maximum API calls exceeded. Please try again in a minute.");
        }
        else if(data?.code?.toString().startsWith("4") || data?.code?.toString().startsWith("5")) {
          setError("Failed to fetch stock data");
        }
        const mappedBarChartData = Object.values(data).map(item => ({
          ...item,
          close: Number(Number(item.close).toFixed(2)),
          fifty_two_week_low: Number(item.fifty_two_week?.low).toFixed(2),
          fifty_two_week_high: Number(item.fifty_two_week?.high).toFixed(2),
          fifty_two_week_range: [Number((Number(item.close) - Number(item.fifty_two_week?.low)).toFixed(2)), Number((Number(item.fifty_two_week?.high) - Number(item.close)).toFixed(2))]
        }));
        setStockData(mappedBarChartData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

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
        const grouped = {};

        data.forEach(({ name, symbol, retrievedPrice, retrievalTime }) => {
          const date = retrievalTime.slice(0, 10); 
          if (!grouped[date]) {
            grouped[date] = { retrievalTime: date };
          }

          grouped[date][`${name} (${symbol})`] = retrievedPrice;
        });

        const chartData = Object.values(grouped).sort(
          (a, b) => new Date(a.retrievalTime) - new Date(b.retrievalTime)
        );
        setCronStockData(chartData);
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

  const CustomBarChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
  
    return (
      <div className="custom-tooltip" style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}>
        <p><strong>{data.symbol}</strong></p>
        <p>Close: {data.close}</p>
        <p>52w Low: {data.fifty_two_week_low}</p>
        <p>52w High: {data.fifty_two_week_high}</p>
      </div>
    );
  };

  return (
    <Flex height="100vh" width="100vw" flexDirection="column">
      <Box bg="blue.600" color="white" px={6} py={4} flexShrink={0}>
        <Heading size="md">My Dashboard</Heading>
      </Box>

      <Flex flex="1" overflow="hidden">
        <Box
          bg="gray.800"
          color="white"
          width="250px"
          padding={4}
          flexShrink={0}
          overflowY="auto"
        >
          <VStack align="start" spacing={4}>
            <Link href="#" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              Home
            </Link>
            <Link href="#" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              Profile
            </Link>
            <Link href="#" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              Settings
            </Link>
          </VStack>
        </Box>
        <Box flex="1" bg="gray.50" p={6} overflowY="auto">
          <HStack spacing={4}>
            <VStack spacing={4}>
              <HStack align="center" mb={2} gap={4} spacing={4}>
                <Heading size="lg" mb={0} color="black">
                  My Followed Stocks
                </Heading>
                <Link fontSize="sm" onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </Link>
                <Modal
                  open={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                >
                  <MuiBox className="followed-modal">
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
                  </MuiBox>
                </Modal>
              </HStack>
              {isLoading && (
                <div>
                  Loading...
                </div>
              )}
              <HStack spacing={4}>
                {!isLoading && stockData.length && stockData.map((stock) => (
                  <StockTile key={stock.symbol} stockData={stock} />
                ))}
              </HStack>
              {error && (
                <Text color="red">
                  {error}
                </Text>
              )}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    52-Week Price Range
                  </Typography>
                  <Box height={300} width={700}>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={stockData}>
                        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                        <XAxis dataKey="symbol" />
                        <YAxis />
                        <Tooltip content={<CustomBarChartTooltip />} />
                        <Bar dataKey="close" barSize={20} fill="#8884d8">
                          <ErrorBar
                            dataKey="fifty_two_week_range"
                            width={4}
                            strokeWidth={2}
                            direction="y"
                          />
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </VStack>
            <VStack spacing={4}>
              <Heading size="lg" mb={0} color="black">
                Stocks of Interest
              </Heading>
              <HStack spacing={4}>
                {!isLoading && stockData.length && stockData.map((stock) => (
                  <StockTile key={stock.symbol} stockData={stock} />
                ))}
              </HStack>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Stock Price (Last 7 Days)
                  </Typography>
                  <Box height={300} width={700}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cronStockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="retrievalTime" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={`AT&T (T)`} stroke="#1976d2" strokeWidth={2} />
                        <Line type="monotone" dataKey={`Verizon (VZ)`} stroke="#2e7d32" strokeWidth={2} />
                        <Line type="monotone" dataKey={`T-Mobile (TMUS)`} stroke="#f57c00" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </VStack>
          </HStack>
        </Box>
      </Flex>
    </Flex>);
}

export default Dashboard