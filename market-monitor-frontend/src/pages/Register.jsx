import React, { useState } from "react";
import { Box, Input, Button, Text, Heading, VStack } from "@chakra-ui/react";
import Tooltip from '../components/Tooltip.jsx';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  // const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
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
              // onFocus={() => setIsUsernameFocused(true)}
              // onBlur={() => setIsUsernameFocused(false)}
            />
          </Tooltip>
          <Tooltip label="Please ensure your password contains at least one lowercase, uppercase, numerical, and special character.">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              // onFocus={() => setIsPasswordFocused(true)}
              // onBlur={() => setIsPasswordFocused(false)}
            />
          </Tooltip>
          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}
          <Button type="submit" colorScheme="blue" width="full">
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Register;