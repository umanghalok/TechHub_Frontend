import React, { useState, useEffect, useContext,useRef } from 'react';
import {useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from "../../../context/DataProvider.jsx";
import { Button,Box, Container, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Tab, Tabs, Typography, Avatar,styled} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { deleteOneUser, fetchAllUsers } from '../../../services/adminService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery, useTheme } from '@mui/material';
import img3 from '../../../assets/images/img3.avif'


export default function User() {
  const { account } = useContext(DataContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [value, setValue] = useState(1);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const debounceTimeoutRef = useRef(null);
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/adminhome');
        break;
      case 1:
        navigate('/users');
        break;
      case 2:
        navigate('/allQuestions');
        break;
      case 3:
        navigate('/allAnswers');
        break;
      default:
        break;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsers();
      setUsers(response);
      setFilteredUsers(response);
    } catch (error) {
      toast.error('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const filteredData = users.filter((user) => {
        return user.username.toLowerCase().includes(e.target.value.toLowerCase());
      });
      setFilteredUsers(filteredData);
    }, 500); //500ms
};



  const deleteUser = async (id) => {
    try {
      const response = await deleteOneUser(id);
      if (response === 'success') {
        toast.success('User deleted successfully!');
        fetchUsers();
      } else {
        toast.error('Failed to delete user. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the user.');
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Box sx={{ minHeight:'100vh',backgroundImage: `url(${img3})`, }}>
      <Box sx={{ backgroundImage: `url(${img3})`, }}>
        <Box sx={{ display: 'flex', justifyContent: 'left', pt: 2, pl: 2 }}>
          <Avatar sx={{ height: '50px', width: '50px' }} />
          <Typography sx={{ fontWeight: 'bold', color: '#fff', mt: 2, ml: 2 }}>{`Hi, ${account.username}`}</Typography>
        </Box>
        <Typography sx={{ fontWeight: 'bold', color: '#fff', mt: 2, ml: 2 }}>{`Email: ${account.email}`}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', color: '#fff' }}>
        <Tabs value={value} onChange={handleChange} centered>
            <Tab label={<StyledText sx={{ fontWeight: "bold", fontSize: isSmallScreen ? '0.75rem' : '1rem',color: '#fff' }}>Analysis</StyledText>} />
            <Tab label={<StyledText sx={{ fontWeight: "bold", fontSize: isSmallScreen ? '0.75rem' : '1rem',color: '#fff' }}>All Users</StyledText>} />
            <Tab label={<StyledText sx={{ fontWeight: "bold", fontSize: isSmallScreen ? '0.75rem' : '1rem',color: '#fff' }}>All Questions</StyledText>} />
            <Tab label={<StyledText sx={{ fontWeight: "bold", fontSize: isSmallScreen ? '0.75rem' : '1rem',color: '#fff' }}>All Answers</StyledText>} />
        </Tabs>
        </Box>
      </Box>
      <Container sx={{ mt: 6, pb: 10 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3}>
                  <TextField
                    variant="outlined"
                    placeholder="Search Username"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearch}
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ bgcolor: '#EEE' }}>
                <TableCell align="center">Username</TableCell>
                <TableCell align="center">Email Address</TableCell>
                <TableCell align="center">Delete User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell align="center">
                    {user?.isAdmin ? (
                      <Button variant="contained">{user.username}</Button>
                    ) : (
                      <Button variant="outlined">{user.username}</Button>
                    )}
                  </TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">
                    {user?.isAdmin ? (
                      <Typography>Admin</Typography>
                    ) : (
                      <DeleteIcon
                        onClick={() => deleteUser(user._id)}
                        sx={{
                          fontSize: '32px', // Adjust size as needed
                          cursor: 'pointer',
                          color: 'red',
                          '&:hover': {
                            color: '#8B0000',
                          },
                        }}
                      >
                        Delete
                      </DeleteIcon>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <ToastContainer />
    </Box>
  );
}
const StyledText = styled(Typography)(() => ({
  transition: 'transform 0.3s, color 0.3s',
  '&:hover': {
      transform: 'translateY(-2px) scale(1.05)',
      color: '#0F1035'
  },
}));