import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Typography, Avatar, Box, TextField, IconButton, MenuItem, Card, CardContent, Button, styled, Pagination, useMediaQuery, useTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Posts from './Posts';
import { DataContext } from "../../../context/DataProvider.jsx";
import { deleteAns, fetchUserFilteredAnswers, fetchOneUserAnswers, givenAnswersTags } from '../../../services/answerService.js';
import SearchIcon from '@mui/icons-material/Search';
import img3 from '../../../assets/images/img3.avif'

export default function MyAnswers() {
    const navigate = useNavigate();
    const { account } = useContext(DataContext);
    const [value, setValue] = useState(2);
    const [filters, setFilters] = useState({ startDate: "", endDate: "", tags: "" });
    const [answers, setAnswers] = useState([]);
    const [filteredAnswers, setFilteredAnswers] = useState([]);
    const [usedTags, setUsedTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [searchQuery, setSearchQuery] = useState("");
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        fetchAnswers();
        tags();
        // eslint-disable-next-line
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        switch (newValue) {
            case 0: navigate('/profile'); break;
            case 1: navigate('/myQuestions'); break;
            case 2: navigate('/myAnswers'); break;
            default: break;
        }
    };

    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const fetchFilteredAnswers = async () => {
        const data = { startDate: filters.startDate, endDate: filters.endDate, tags: filters.tags };
        let response = await fetchUserFilteredAnswers(data, account);
        setAnswers(response);
        setFilteredAnswers(response);
    };

    const fetchAnswers = async () => {
        let response = await fetchOneUserAnswers(account);
        setAnswers(response);
        setFilteredAnswers(response);
    };

    const tags = async () => {
        let response = await givenAnswersTags(account);
        setUsedTags(response);
    };

    const handleSearch = (searchQuery) => {
        setSearchQuery(searchQuery.target.value);
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            const filteredData = filteredAnswers.filter((answer) => {
                return answer.answer.toLowerCase().includes(searchQuery.target.value.toLowerCase());
            });
            setAnswers(filteredData);
        }, 500); //500ms
    };

    const getPostsForPage = (allPosts, page) => {
        const startIndex = (page - 1) * postsPerPage;
        return allPosts.slice(startIndex, startIndex + postsPerPage);
    };

    const handlePaginationChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAns(id);
            toast.success('Answer deleted successfully!');
            fetchAnswers();
        } catch (err) {
            console.error('Error deleting the answer:', err);
            toast.error('Error deleting answer. Please try again!');
        }
    };

    const handleReset = () => {
        setFilters({ startDate: "", endDate: "", tags: "" });
        setSearchQuery("");
        fetchAnswers();
        setFilteredAnswers(answers);
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
                            Find your answers between:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', mb: 2 }}>
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
                                <StyledButton sx={{ ml: 1, mr: 1 }} onClick={fetchFilteredAnswers}>Search</StyledButton>
                                <StyledButton onClick={handleReset}>Reset</StyledButton>
                            </Box>
                        </Box>
                    </Box>
                    <TextField
                        variant="outlined"
                        placeholder="Search Answers"
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
            <Card sx={{ minHeight: '100vh', backgroundImage: `url(${img3})` }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={Math.ceil(answers.length / postsPerPage)}
                            page={currentPage}
                            onChange={handlePaginationChange}
                            color="primary"
                            size="large"
                            sx={{
                                marginBottom: '5px',
                                '& .MuiPaginationItem-root': { color: '#fff' },
                            }}
                        />
                    </Box>
                    <Posts posts={getPostsForPage(answers, currentPage)} onDelete={handleDelete} />
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
