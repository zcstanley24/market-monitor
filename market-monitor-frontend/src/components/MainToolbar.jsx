import React, { useState } from "react";
import {
  Typography,
  Button,
  Stack,
  Link,
  AppBar,
  Toolbar,
  Modal,
  Box,
} from '@mui/material';
import mmLogo from '../assets/mmlogo.png';
import { useNavigate } from 'react-router-dom';
import '../styles/MainToolbar.css';

const MainToolbar = ({currentPage, username}) => {
  const navigate = useNavigate();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleLogout = () => {
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((res) => {
        if(!res.ok) {
          throw new Error('Logout failed');
        }
        return res;
      })
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        setIsErrorModalOpen(true);
      });
  };

  return (
    <AppBar position="static" sx={{backgroundColor: "#2E7D32"}} elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ alignItems: 'flex-end', gap: '0.75rem' }}>
          <img src={mmLogo} className="company-logo"/>
          <Typography variant="h5" color="white" fontFamily="inter">
            Market Monitor
          </Typography>
        </Stack>
        <Stack direction="row" spacing={5}>
          <Link onClick={() => {navigate("/")}} className="toolbar-buttons" underline="none" variant="button" sx={{ cursor: "pointer" }}>
            <Typography color="white" fontFamily="system-ui" fontWeight={600}>
              My Dashboard
            </Typography>
            {currentPage === "dashboard" && (
              <Typography className="current-page-caret" marginTop="0.75rem" marginLeft="1.25rem"/>
            )}
          </Link>
          <Link onClick={() => {navigate("/pick-my-stocks")}} className="toolbar-buttons" underline="none" variant="button" sx={{ cursor: "pointer" }}>
            <Typography color="white" fontFamily="system-ui" fontWeight={600}>
              Pick My Stocks
            </Typography>
            {currentPage === "pick-my-stocks" && (
              <Typography className="current-page-caret" marginTop="0.75rem" marginLeft="1rem"/>
            )}
          </Link>
          <Link onClick={() => {navigate("/stocks-of-interest")}} className="toolbar-buttons" underline="none" variant="button" sx={{ cursor: "pointer" }}>
            <Typography color="white" fontFamily="system-ui" fontWeight={600}>
              Stocks of Interest
            </Typography>
            {currentPage === "stocks-of-interest" && (
              <Typography className="current-page-caret" marginTop="0.75rem" marginLeft="1.75rem"/>
            )}
          </Link>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography fontFamily="system-ui" fontWeight={400} sx={{ minWidth: 160 }}>
            {username ? `Welcome, ${username}!` : "Welcome!"}
          </Typography>
          <Button className="logout-button" color="white" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Toolbar>
      <Modal
        open={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      >
        <Box className="error-modal" width={400}>
          <Box>
            <Typography variant="h4" fontFamily="system-ui">
              Oops!
            </Typography>
            <Typography mt="1.5rem" fontFamily="system-ui">
              We encountered an error when attempting to log you out. Please try again later.
            </Typography>
          </Box>
          <Box mt="1.5rem">
            <Button className="error-modal-button" onClick={() => setIsErrorModalOpen(false)} sx={{borderColor: "#2E7D32"}} variant="outlined">
              <Typography color="#2E7D32">
                Close
              </Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
    </AppBar>
  );
};

export default MainToolbar