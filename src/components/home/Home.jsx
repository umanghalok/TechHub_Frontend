import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Button, CssBaseline, Paper, Box, Grid, Typography,styled} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import SearchIcon from '@mui/icons-material/Search';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { DataContext } from '../../context/DataProvider.jsx';
import img3 from '../../assets/images/img3.avif'
import home from '../../assets/images/home.avif'


export default function Home() {
  const { account } = useContext(DataContext);
  return (
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${home})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ backgroundImage: `url(${img3})`, color:'black' }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <ComputerIcon />
            </Avatar>
            <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
              Welcome to Tech Hub!
            </Typography>
            <Typography variant="h5">
              Have a question? We've got answers!
            </Typography>
            {account?.isAdmin ? (
            <>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Grid item>
                <NavButton sx={{backgroundColor: '#0F1035','&:hover': {backgroundColor: '#1A1F6D'}}} component={RouterLink} to="/adminhome" variant="contained" size="large">
                  Admin Panel
                </NavButton>
              </Grid>
            </Grid>
            </>
            ):(
            <>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
              <Grid item>
                <NavButton sx={{backgroundColor: '#0F1035','&:hover': {backgroundColor: '#0F1035'}}} component={RouterLink} to="/addquestion" variant="contained" >
                <Avatar sx={{ bgcolor: '#0F1035' }}>
                  <QuestionMarkIcon />
                </Avatar>
                  Ask a Question
                </NavButton>
              </Grid>
              <Grid item>
                <NavButton sx={{backgroundColor: '#0F1035','&:hover': {backgroundColor: '#0F1035'}}} component={RouterLink} to="/questions" variant="contained">
                <Avatar sx={{ bgcolor: '#0F1035' }}>
                  <SearchIcon />
                </Avatar>
                  Browse Questions
                </NavButton>
              </Grid>
            </Grid>
            </>
            )}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Explore our community-driven platform to find solutions or ask for help.
            </Typography>
          </Box>
        </Grid>
      </Grid>
  );
}

const NavButton = styled(Button)(() => ({
  transition: 'transform 0.3s, color 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
}}));
