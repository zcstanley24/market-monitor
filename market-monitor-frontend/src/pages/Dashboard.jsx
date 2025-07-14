import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Link,
  Heading,
} from '@chakra-ui/react';
import StockTile from '../components/StockTile.jsx';

const Dashboard = () => {
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetch("http://localhost:8080/stock-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stock data");
        return res.json();
      })
      .then((data) => {
        setStockData(data);
        setIsLoading(false);
        console.log(data);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

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
          <Heading size="lg" mb={4}>
            Dashboard Content
          </Heading>
          {isLoading && (
            <div>
              Loading...
            </div>
          )}
          {!isLoading && stockData && (
            <StockTile stockData={stockData} />
          )}
          {error && (
            <Text>
              {error}
            </Text>
          )}
        </Box>
      </Flex>
    </Flex>);
}

export default Dashboard