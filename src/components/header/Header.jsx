import * as React from 'react';
import { Avatar,AppBar, styled, Box, Toolbar, Typography, Button, IconButton, Drawer, List, ListItemText, ListItemButton, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import ComputerIcon from '@mui/icons-material/Computer';
import { DataContext } from "../../context/DataProvider";
import { useContext } from "react";


export default function ButtonAppBar({ isUserAuthenticated, isAuthenticated }) {

  const { account, setAccount } = useContext(DataContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleListItemClick = (path) => () => {
    navigate(path);
    setDrawerOpen(false); // Close the drawer
  };

  const handleLogout = () => {
    navigate('/login');
    //console.log(account);
    setAccount(null);
    isUserAuthenticated(false);
    sessionStorage.clear();
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/');
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  const navigateToPanel = () => {
    navigate('/adminHome');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ bgcolor: '#0F1035'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
          {isSmallScreen &&<MenuIcon />}
          </IconButton>
          <Avatar sx={{ bgcolor: '#0F1035' }}>
              <ComputerIcon />
            </Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1}}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              TECH HUB
            </Link>
          </Typography>
          <>
          {!isSmallScreen && (
            <>
              <NavButton color="inherit" onClick={handleHome}>Home</NavButton>
              {account && isAuthenticated ? (
                <>
                  {account.isAdmin && (
                    <NavButton color="inherit" onClick={navigateToPanel}>{`Hi, ${account.username}`}</NavButton>
                  )}
                  {!account.isAdmin && (
                    <NavButton color="inherit" onClick={navigateToProfile}>{`Hi, ${account.username}`}</NavButton>
                  )}
                  <NavButton color="inherit" onClick={handleLogout}>Logout</NavButton>
                </>
              ) : (
                <>
                  <NavButton color="inherit" onClick={handleSignup}>Register</NavButton>
                  <NavButton color="inherit" onClick={handleLogin}>Login</NavButton>
                </>
              )}
            </>
          )}
          </>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 ,height:'100vh',backgroundColor: '#DCF2F1'}}
          role="presentation"
          onClick={toggleDrawer(false)} // Close drawer on click outside list items
          onKeyDown={toggleDrawer(false)}
        >
          <List >
            <ListItemButton onClick={handleListItemClick('/')}>
              <ListItemText primary="Home" />
            </ListItemButton>
            {account && isAuthenticated ? (
              <>
                <ListItemButton>
                  <ListItemText primary={`Hi, ${account.username}`} />
                </ListItemButton>
                {!account.isAdmin && (
                <ListItemButton onClick={handleListItemClick('/profile')}>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                )}
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton onClick={handleSignup}>
                  <ListItemText primary="Register" />
                </ListItemButton>
                <ListItemButton onClick={handleLogin}>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

const NavButton = styled(Button)(() => ({
  transition: 'transform 0.3s, color 0.3s',
  '&:hover': {
    transform: ' scale(1.05)',
    color: '#007BFF',
    '&::after': {
      transform: 'scaleX(1)',
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '2px',
    backgroundColor: '#007BFF',
    transform: 'scaleX(0)',//size of line
    transition: 'transform 0.3s',
  },
}));