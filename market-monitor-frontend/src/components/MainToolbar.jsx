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
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import mmLogo from '../assets/mmlogo.png';
import { useNavigate } from 'react-router-dom';
import '../styles/MainToolbar.css';
import { colors } from "../styles/colors";

const MainToolbar = ({currentPage, username}) => {
  const navigate = useNavigate();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  
  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  const handleLogout = () => {
    fetch(`${backendUrl}/auth/logout`, {
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
    <AppBar position="static" style={{backgroundColor: colors.primaryGreen}} elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {(!isMediumScreen || isSmallScreen) && (<Stack direction="row" sx={{ alignItems: 'flex-end', gap: '0.75rem' }}>
          <img src={mmLogo} className="company-logo"/>
          <Typography variant="h5" color="white" fontFamily="inter">
            Market Monitor
          </Typography>
        </Stack>)}
        {!isSmallScreen && (<Stack direction="row" spacing={5}>
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
        </Stack>)}
        {!isSmallScreen && (<Stack direction="row" spacing={2} alignItems="center">
          <Typography fontFamily="system-ui" fontWeight={400} sx={{ minWidth: 160 }}>
            {username ? `Welcome, ${username}!` : "Welcome!"}
          </Typography>
          <Button className="logout-button" color="white" variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>)}
        {isSmallScreen && (<IconButton
            color="inherit"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
      {isSmallScreen && (<Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 5,
          }}}
      >
        <Box
          onClick={toggleDrawer(false)}
          backgroundColor={colors.primaryGreen}
          height='100vh'
          pl={3}
        >
          <List>
            <ListItem button onClick={() => navigate("/")}>
              {currentPage === "dashboard" && (<ChevronRightIcon sx={{stroke: 'white', fill: 'white'}} />)}
              <Typography sx={{fontFamily: 'system-ui', width: '100%', textAlign: 'right', color: 'white'}}>My Dashboard</Typography>
            </ListItem>
            <ListItem button onClick={() => navigate("/pick-my-stocks")}>
              {currentPage === "pick-my-stocks" && (<ChevronRightIcon sx={{stroke: 'white', fill: 'white'}} />)}
              <Typography sx={{fontFamily: 'system-ui', width: '100%', textAlign: 'right', color: 'white'}}>Pick My Stocks</Typography>
            </ListItem>
            <ListItem button onClick={() => navigate("/stocks-of-interest")}>
              {currentPage === "stocks-of-interest" && (<ChevronRightIcon sx={{stroke: 'white', fill: 'white'}} />)}
              <Typography sx={{fontFamily: 'system-ui', width: '100%', textAlign: 'right', color: 'white'}}>Stocks of Interest</Typography>
            </ListItem>
            <ListItem button onClick={() => handleLogout()}>
              <Typography sx={{fontFamily: 'system-ui', width: '100%', textAlign: 'right', color: 'white'}}>Logout</Typography>
            </ListItem>
          </List>
        </Box>
      </Drawer>)}
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
            <Button className="error-modal-button" onClick={() => setIsErrorModalOpen(false)} style={{borderColor: colors.primaryGreen}} variant="outlined">
              <Typography color={colors.primaryGreen}>
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