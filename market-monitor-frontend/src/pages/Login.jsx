import React, { useState } from "react";
import { Box, Input, Button, Text, Heading, VStack } from "@chakra-ui/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Login failed");
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
    if(username.length > 20) {
      setError("Usernames cannot exceed 20 characters");
    }
    else {
      const alphanumeric = username.replace(/[^a-z0-9]/gi, "");
      setUsername(alphanumeric);
    }
  };

  const handlePasswordChange = (password) => {
    if(password.length > 20) {
      setError("Passwords cannot exceed 20 characters");
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
        Login
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing="4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}
          <Button type="submit" colorScheme="blue" width="full">
            Sign In
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default Login;