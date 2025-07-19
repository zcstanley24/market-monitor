import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Paper,
  Link,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from "../styles/colors";
import mmGreenLogo from '../assets/mmgreenlogo.png';
import '../styles/Dashboard.css';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const message = location.state?.toastMessage;
    if (message) {
      toast.success(message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    const defaultErrorText = "Error encountered when attempting to log you in. \
        Please check your internet or try again later.";

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
        setError(errorText || defaultErrorText);
      }
      else {
        navigate('/');
      }

    } catch (err) {
      setError(defaultErrorText);
    }
  };

  const handleUsernameChange = (username) => {
    if(username.length > 30) {
      setError("Usernames cannot exceed 30 characters");
    }
    else {
      setError("");
      const alphanumeric = username.replace(/[^a-z0-9]/gi, "");
      setUsername(alphanumeric);
    }
  };

  const handlePasswordChange = (password) => {
    if(password.length > 30) {
      setError("Passwords cannot exceed 30 characters");
    }
    else {
      setError("");
      setPassword(password);
    }
  };

  return (
    <Stack sx={{minHeight: '100vh', minWidth: '100vw', justifyContent: 'center'}} style={{backgroundColor: colors.primaryGreen}}>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', gap: '0.75rem' }}>
              <img src={mmGreenLogo} style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
              }}/>
              <Typography variant="h5" fontFamily="inter">
                Market Monitor
              </Typography>
            </Stack>
            <Typography sx={{fontFamily: 'system-ui', mt: 1.5, fontSize: '20px'}}>
              Welcome! Please sign in below.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'system-ui',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'system-ui',
                  },
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'system-ui',
                  },
                  '& .MuiInputLabel-root': {
                    fontFamily: 'system-ui',
                  },
                }}
              />
              {error && (
                <Typography color={colors.errorRed} mt={2} fontSize="sm" fontFamily="system-ui" textAlign="center">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{backgroundColor: colors.primaryGreen, fontFamily: 'system-ui'}}
              >
                Sign In
              </Button>
              <Typography sx={{fontFamily: "system-ui"}}>
                New user? Click{' '}
                <Link
                  onClick={() => navigate("/register")}
                  sx={{ padding: 0, minWidth: 'auto', cursor: 'pointer' }}
                >
                  here
                </Link>{' '}to sign up
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Stack>
  );
}

export default Login;