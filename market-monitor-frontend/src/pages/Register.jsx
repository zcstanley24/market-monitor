import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Tooltip,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import options from '../data/stockData.js';
import { colors } from "../styles/colors";
import mmGreenLogo from '../assets/mmgreenlogo.png';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [showUsernameRequirements, setShowUsernameRequirements] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const usernameInfoRef = useRef(null);
  const passwordInfoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        usernameInfoRef.current &&
        !usernameInfoRef.current.contains(event.target)
      ) {
        setShowUsernameRequirements(false);
      }
      if (
        passwordInfoRef.current &&
        !passwordInfoRef.current.contains(event.target)
      ) {
        setShowPasswordRequirements(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if(!selectedSymbols.length || selectedSymbols.length < 3) {
      setError("Please ensure you have selected 3 stocks");
      return;
    }
    else if(selectedSymbols.length > 3) {
      setError("Please select only three stocks");
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
      setError("Your password must have at least one lowercase, uppercase, numerical, and special character");
      return;
    }

    const followedStocks = selectedSymbols.join(",");
    const defaultErrorText = "Error encountered when attempting to register your new user. \
        Please check your internet or try again later.";

    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, followedStocks }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || defaultErrorText);
      }
      else {
        navigate("/login", { state: { toastMessage: 'Your account was successfully created! Please log in to continue.' } });
      }

    } catch (err) {
      setError(defaultErrorText);
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
      setError("Please select only 3 stocks");
    }
    setSelectedSymbols(newValues);
  }

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
              Welcome! Please register below.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Tooltip title="Please ensure your username is unique and contains between 8 and 30 characters."
                placement={isSmallScreen ? "top" : "right"} arrow
                open={showUsernameRequirements}
                slotProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: '#333',
                      color: '#fff',
                      fontSize: '0.95rem',
                      padding: '8px 8px 8px 12px',
                      borderRadius: '6px',
                      fontFamily: 'system-ui',
                    },
                  },
                  arrow: {
                    sx: {
                      color: '#333',
                    },
                  },
                }}>
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
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <InfoOutlinedIcon ref={usernameInfoRef} cursor="pointer" color="action" onClick={() => setShowUsernameRequirements(true)}/>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Tooltip>
              <Tooltip title="Please ensure your password is between 8 and 30 characters,
                as well as contains at least one lowercase, one uppercase, one numerical, 
                and one special character."
                placement={isSmallScreen ? "top" : "right"} arrow 
                open={showPasswordRequirements}
                slotProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: '#333',
                      color: '#fff',
                      fontSize: '0.95rem',
                      padding: '8px 8px 8px 12px',
                      borderRadius: '6px',
                      fontFamily: 'system-ui',
                    },
                  },
                  arrow: {
                    sx: {
                      color: '#333',
                    },
                  },
                }}>
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
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <InfoOutlinedIcon ref={passwordInfoRef} cursor="pointer" color="action" onClick={() => setShowPasswordRequirements(true)}/>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Tooltip>
              <FormControl fullWidth sx={{
                mt: 2,
                '& .MuiInputLabel-root': {
                  fontFamily: 'system-ui',
                  fontSize: '1rem',
                },
                '& .MuiSelect-select': {
                  fontFamily: 'system-ui',
                  fontSize: '1rem',
                },
                '& .MuiMenuItem-root': {
                  fontFamily: 'system-ui',
                  fontSize: '0.9rem',
                },
              }}>
                <InputLabel id="array-dropdown-label">Please select 3 stocks</InputLabel>
                <Select
                  labelId="array-dropdown-label"
                  id="array-dropdown"
                  multiple
                  value={selectedSymbols}
                  onChange={handleFollowedDropdownChange}
                  renderValue={(selected) => selected.join(", ")}
                  label="Please select 3 stocks"
                >
                  {options.map((option) => (
                    <MenuItem key={option.name} value={option.symbol}>
                      <Checkbox checked={selectedSymbols.includes(option.symbol)} />
                      <ListItemText primary={option.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                Sign up
              </Button>
              <Typography sx={{fontFamily: "system-ui"}}>
                Already registered? Click{' '}
                <Link
                  onClick={() => navigate("/login")}
                  sx={{ padding: 0, minWidth: 'auto', cursor: 'pointer' }}
                >
                  here
                </Link>{' '}to sign in
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Stack>
  );
}

export default Register;