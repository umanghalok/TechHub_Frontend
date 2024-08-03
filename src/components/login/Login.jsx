import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, CssBaseline, Box, TextField, Button,  Typography, Link, Paper, Grid, IconButton, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { DataContext } from '../../context/DataProvider.jsx';
import { userLogin } from '../../services/userService.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img2 from '../../assets/images/img2.avif'

function Copyright() {
  return (
    <Typography variant="body2" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://umanghalok.netlify.app/">
        Umangh Alok
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Login = ({ isUserAuthenticated }) => {
  const navigate = useNavigate(); 

  const LoginInitialValues = {
      username: '',
      password: ''
  }
  const [login, setLogin] = useState(LoginInitialValues);

  const { setAccount } = useContext(DataContext);

  const onInputChange = (e) => {
      setLogin({ ...login, [e.target.name]: e.target.value });
  }

  const toSignup = () => {
      navigate('/signup');
  }

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const loginUser = async () => {
      try {
          let response = await userLogin(login);
          if (response.status === 200) {
              setLogin(LoginInitialValues);
              sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
              sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
              setAccount({ username: response.data.username, email: response.data.email, isAdmin: response.data.isAdmin });
              isUserAuthenticated(true);
              toast.success('Login successful!');
              setTimeout(() => {
                navigate(response.data.isAdmin ? '/users' : '/');
              }, 2000);
          } else {
              toast.error('Something went wrong! Please try again.');
          }
      } catch (err) {
          toast.error('Error while logging in.');
      }
  }

  return (
    <>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${img2})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                onChange={(e) => onInputChange(e)}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                onChange={(e) => onInputChange(e)}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                onClick={() => loginUser()}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    onClick={() => toSignup()}
                    variant="body2"
                    style={{ cursor: 'pointer' }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
}

export default Login;
