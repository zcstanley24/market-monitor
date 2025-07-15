import React, { useState } from "react";
import { Box, Input, Button, Text, Heading, VStack } from "@chakra-ui/react";
import Tooltip from '../components/Tooltip.jsx';
import {
  Modal,
  Typography,
  Box as MuiBox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
} from '@mui/material';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedSymbols, setSelectedSymbols] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if(!selectedSymbols.length) {
      setError("Please choose at least one stock");
      return;
    }

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }
    else if(username.length < 8 || password.length < 8) {
      setError("Your username and password length must be at least 8 characters");
      return;
    }
    else if(!/[a-z]/.test(password) || !/[A-Z]/.test(password) || 
    !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Your password does not meet the character requirements");
      return;
    }

    const followedStocks = selectedSymbols.join(",");

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, followedStocks }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Registration failed");
        return;
      }

      const data = await response.text();
      console.log(data);

      window.location.href = "/";

    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  const handleUsernameChange = (username) => {
    if(username.length > 30) {
      setError("Your username length cannot exceed 30 characters");
    }
    else {
      const alphanumeric = username.replace(/[^a-z0-9]/gi, "");
      setUsername(alphanumeric);
    }
  };

  const handlePasswordChange = (password) => {
    if(password.length > 30) {
      setError("Your password length cannot exceed 30 characters");
    }
    else {
      setPassword(password);
    }
  };

  const handleFollowedDropdownChange = (e) => {
    const newValues = e.target.value;

    if(newValues.length <= 3) {
      setError("");
    }
    else {
      setError("Please select less than or equal to 3 stocks");
    }
    setSelectedSymbols(newValues);
  }

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="20"
      p="8"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
    >
      <Heading mb="6" textAlign="center">
        Register for Market Monitor
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <Tooltip label="Please ensure your username contains only alphanumeric characters and is less than 20 characters">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
            />
          </Tooltip>
          <Tooltip label="Please ensure your password contains at least one lowercase, uppercase, numerical, and special character.">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
          </Tooltip>
          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
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
          <Button type="submit" colorScheme="blue" width="full">
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Register;