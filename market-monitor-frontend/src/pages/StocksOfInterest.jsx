import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box as MuiBox,
} from '@mui/material';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Link,
  Heading,
} from '@chakra-ui/react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";
import StockTile from '../components/StockTile.jsx';
import '../styles/App.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [cronStockChartTimeSeriesData, setCronStockChartTimeSeriesData] = useState([]);
  const [cronStockChartRangeData, setCronStockChartRangeData] = useState([]);
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
        const groupedTimeSeries = {};
        const groupedRange = {};

        data.forEach(({ name, symbol, retrievedPrice, retrievalTime, low, high }) => {
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
        setCronStockData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const CustomVolumeChartTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
  
    return (
      <div className="custom-tooltip" style={{ color: 'black', background: '#fff', border: '1px solid #ccc', padding: 10 }}>
        <p><strong>{data.symbol}</strong></p>
        <p>Today's Volume: {Number(data.volume).toLocaleString()}</p>
        <p>Average Volume: {Number(data.average_volume).toLocaleString()}</p>
        <p>Relative Volatility: {data.relative_volatility}</p>
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
            <Link href="/" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              My Stocks
            </Link>
            <Link href="/stocks-of-interest" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              Stocks of Interest
            </Link>
            <Link href="#" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              Settings
            </Link>
          </VStack>
        </Box>
        <Box flex="1" bg="gray.50" p={6} overflowY="auto">
          <HStack spacing={4}>
            <VStack spacing={4}>
              <Heading size="lg" mb={0} color="black">
                Stocks of Interest
              </Heading>
              <HStack spacing={4}>
                {!isLoading && cronStockData.length && cronStockData.slice(0,3).map((stock) => (
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
                      <LineChart data={cronStockChartTimeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="retrievalTime" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={`Apple (AAPL)`} stroke="#1976d2" strokeWidth={2} />
                        <Line type="monotone" dataKey={`Google (GOOG)`} stroke="#2e7d32" strokeWidth={2} />
                        <Line type="monotone" dataKey={`Amazon (AMZN)`} stroke="#f57c00" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Price Range (Last 7 Days)
                  </Typography>
                  <Box height={400} width={700}>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={cronStockChartRangeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="retrievalTime" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="Apple (AAPL)"
                          stackId="1"
                          stroke="#8884d8"
                          fill="#8884d8"
                          name="Apple"
                        />
                        <Area
                          type="monotone"
                          dataKey="Google (GOOG)"
                          stackId="1"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          name="Google"
                        />
                        <Area
                          type="monotone"
                          dataKey="Amazon (AMZN)"
                          stackId="1"
                          stroke="#ffc658"
                          fill="#ffc658"
                          name="Amazon"
                        />
                      </AreaChart>
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