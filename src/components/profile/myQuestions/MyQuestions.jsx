import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Tabs, Tab, Typography, Avatar, Box, TextField, MenuItem, Card, 
    CardContent, Button, styled, Pagination, useMediaQuery, useTheme, IconButton
} from '@mui/material';
import Posts from './Posts';
import { DataContext } from "../../../context/DataProvider.jsx";
import { 
    fetchUserFilteredQuestions, fetchUserQuestions, usedUserTags, deleteQue 
} from '../../../services/questionService.js';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img3 from '../../../assets/images/img3.avif'

export default function MyQuestions() {
    const navigate = useNavigate();
    const { account } = useContext(DataContext);
    const [value, setValue] = useState(1);
    const [filters, setFilters] = useState({ startDate: "", endDate: "", tags: "" });
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [usedTags, setUsedTags] = useState([]);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const [searchQuery, setSearchQuery] = useState("");
    const debounceTimeoutRef = useRef(null);

    // Handle tab changes
    const handleChange = (event, newValue) => {
        setValue(newValue);
        const routes = ['/profile', '/myQuestions', '/myAnswers'];
        navigate(routes[newValue]);
    };

    // Handle input changes
    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Fetch filtered questions
    const fetchFilteredQuestions = async () => {
        const data = { ...filters };
        const response = await fetchUserFilteredQuestions(data, account);
        setQuestions(response);
        setFilteredQuestions(response); // Set filtered questions
    };

    // Fetch all questions
    const fetchQuestions = async () => {
        const response = await fetchUserQuestions(account);
        setQuestions(response);
        setFilteredQuestions(response); // Set filtered questions
    };

    // Fetch used tags
    const fetchTags = async () => {
        const response = await usedUserTags(account);
        setUsedTags(response);
    };

    useEffect(() => {
        fetchQuestions();
        fetchTags();
        // eslint-disable-next-line
    }, []);

    // Pagination
    const getPostsForPage = (allPosts, page) => {
        const startIndex = (page - 1) * postsPerPage;
        return allPosts.slice(startIndex, startIndex + postsPerPage);
    };

    const handlePaginationChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // Handle post deletion
    const handleDelete = async (id) => {
        try {
            await deleteQue(id);
            fetchQuestions(); // Re-fetch questions after deletion
            toast.success('Question deleted successfully!');
        } catch (error) {
            toast.error('Error deleting question.');
        }
    };

    const handleSearch = (searchQuery) => {
        setSearchQuery(searchQuery.target.value);
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            const filteredData = filteredQuestions.filter((que) => {
                return que.title.toLowerCase().includes(searchQuery.target.value.toLowerCase());
            });
            setQuestions(filteredData);
        }, 500); //500ms
    };

    const handleReset = () => {
        setFilters({ startDate: "", endDate: "", tags: "" });
        setSearchQuery("");
        fetchQuestions();
        setFilteredQuestions(questions);
    };

    return (
        <Box>
            <Box sx={{ backgroundImage: `url(${img3})` }}>
                <Box sx={{ display: 'flex', justifyContent: 'left', pt: 2, pl: 2 }}>
                    <Avatar sx={{ height: '50px', width: '50px' }} />
                    <Typography sx={{ fontWeight: 'bold', color: '#fff', mt: 2, ml: 2 }}>{`Hi, ${account.username}`}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 'bold', color: '#fff', mt: 2, ml: 2 }}>{`Email: ${account.email}`}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', color: '#fff' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label={<StyledText sx={{ fontWeight: 'bold', color: '#fff' }}>Analysis</StyledText>} />
                        <Tab label={<StyledText sx={{ fontWeight: 'bold', color: '#fff' }}>Questions</StyledText>} />
                        <Tab label={<StyledText sx={{ fontWeight: 'bold', color: '#fff' }}>Answers</StyledText>} />
                    </Tabs>
                </Box>
            </Box>
            <Card variant="outlined" sx={{ bgcolor: '#EEEEEE' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Find your questions between:
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={onChange}
                                    sx={{ mr: 2 }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Typography sx={{ mr: 2 }}>To</Typography>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={onChange}
                                    sx={{ mr: 2 }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TextField
                                    label="Tag"
                                    select
                                    name="tags"
                                    value={filters.tags}
                                    onChange={onChange}
                                    sx={{ minWidth: 200 }}
                                    defaultValue=""
                                >
                                    <MenuItem value="" disabled>Select a tag</MenuItem>
                                    {usedTags.map(tag => (
                                        <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                                    ))}
                                </TextField>
                                <StyledButton sx={{ml:1,mr:1}}onClick={fetchFilteredQuestions}>Search</StyledButton>
                                <StyledButton onClick={handleReset}>Reset</StyledButton>
                            </Box>
                        </Box>
                    </Box>
                    <TextField
                        variant="outlined"
                        placeholder="Search Questions"
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
                </CardContent>
            </Card>
            <Card sx={{ minHeight:'100vh',backgroundImage: `url(${img3})` }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={Math.ceil(questions.length / postsPerPage)}
                            page={currentPage}
                            onChange={handlePaginationChange}
                            color="primary"
                            size="large"
                            sx={{ marginBottom: '5px', '& .MuiPaginationItem-root': { color: '#fff' }, '& .Mui-selected': { backgroundColor: '#4CAF50' } }}
                        />
                    </Box>
                    <Posts posts={getPostsForPage(questions, currentPage)} onDelete={handleDelete} />
                </CardContent>
            </Card>
            <ToastContainer />
        </Box>
    );
}

const StyledButton = styled(Button)(() => ({
    transition: 'transform 0.3s, color 0.3s',
    '&:hover': {
      transform: 'scale(1.2)',
  }}));

  const StyledText = styled(Typography)(() => ({
    transition: 'transform 0.3s, color 0.3s',
    '&:hover': {
        transform: 'translateY(-2px) scale(1.05)',
        color: '#0F1035'
    },
  }));
