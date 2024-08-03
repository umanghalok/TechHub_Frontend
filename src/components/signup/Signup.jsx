import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Link, Box, Grid, Typography, IconButton, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { userSignup } from '../../services/userService.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img1 from '../../assets/images/img1.avif'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://umanghalok.netlify.app">
        Umangh Alok
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Signup = () => {
  const navigate = useNavigate();
  const SignupInitialValues = {
    email: '',
    username: '',
    password: ''
  };

  const [signup, setSignup] = useState(SignupInitialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const onInputChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    let emailError = '';
    let passwordError = '';

    if (!emailRegex.test(signup.email)) {
      emailError = 'Invalid email address';
      valid = false;
    }

    if (!passwordRegex.test(signup.password)) {
      passwordError = 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character';
      valid = false;
    }

    setErrors({ email: emailError, password: passwordError });
    return valid;
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const signupUser = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let response = await userSignup(signup);
      if (response.status === 200) {
        setSignup(SignupInitialValues);
        toast.success('Signup successful! Redirecting to Login...');
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      } 
      else {
        toast.error('Something went wrong! Please try again.');
      }
    } catch (err) {
      toast.error('Email or Username already in use.');
    }
  };

  const toLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Grid container sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5}>
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
              Sign Up
            </Typography>
            <Box>
              <TextField
                margin="normal"
                onChange={(e) => onInputChange(e)}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                onChange={(e) => onInputChange(e)}
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
              />
              <TextField
                margin="normal"
                onChange={(e) => onInputChange(e)}
                required
                fullWidth
                name="password"
                label="Password"
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
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <Button
                type="submit"
                fullWidth
                onClick={() => signupUser()}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    onClick={() => toLogin()}
                    variant="body2"
                    style={{ cursor: 'pointer' }}
                  >
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${img1})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>
      <ToastContainer />
    </>
  );
};

export default Signup;
