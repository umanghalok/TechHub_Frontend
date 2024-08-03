import React, { useEffect, useContext, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Typography, Avatar, Box, TextField, MenuItem, Card, CardContent, Button, IconButton,styled } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import Posts from './Posts.jsx';
import { DataContext } from "../../../context/DataProvider.jsx";
import { deleteAns, fetchAllFilteredAnswers, fetchAllAnswers, givenAllAnswersTags } from '../../../services/answerService.js';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img3 from '../../../assets/images/img3.avif'

export default function UserAnswers() {
    const navigate = useNavigate();
    const [value, setValue] = useState(3);
    const { account } = useContext(DataContext);
    const [filters, setFilters] = useState({ startDate: "", endDate: "", tags: "" });
    const [answers, setAnswers] = useState([]);
    const [filteredAns, setFilteredAns] = useState([]);
    const [usedTags, setUsedTags] = useState([]); 
    const [searchQuery, setSearchQuery] = useState("");
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const debounceTimeoutRef = useRef(null);
    

    // Handle tab changes
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

    // Handle input changes
    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Fetch filtered answers
    const fetchFilteredAnswers = async () => {
        const data = { startDate: filters.startDate, endDate: filters.endDate, tags: filters.tags };
        let response = await fetchAllFilteredAnswers(data);
        setFilteredAns(response);
        setAnswers(response);
    };

    // Fetch all answers
    const fetchAnswers = async () => {
        let response = await fetchAllAnswers();
        setAnswers(response);
        setFilteredAns(response);
    };

    // Fetch used tags
    const tags = async () => {
        let response = await givenAllAnswersTags();
        setUsedTags(response);
    };


    const handleSearch = (searchQuery) => {
        setSearchQuery(searchQuery.target.value);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            const filteredData = filteredAns.filter((answer) => {
                return answer.answer.toLowerCase().includes(searchQuery.target.value.toLowerCase());
            });
            setAnswers(filteredData);
        }, 500); //500ms
    };

    useEffect(() => {
        fetchAnswers();
        tags();
    }, []);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
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
            await deleteAns(id);
            toast.success('Answer deleted successfully!');
            fetchAnswers(); // Re-fetch answers after deletion
        } catch (error) {
            toast.error('Failed to delete answer. Please try again.');
            console.error('Error deleting answer:', error);
        }
    };

    const handleReset = () => {
        setFilters({ startDate: "", endDate: "", tags: "" });
        setSearchQuery("");
        fetchAnswers();
        setFilteredAns(answers);
    };


    return (
        <Box>
            <Box sx={{backgroundImage: `url(${img3})`, }}>
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
            <Card variant="outlined" sx={{ bgcolor: '#EEEEEE' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Find your answers between:
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
                                    onChange={onChange}
                                    value={filters.startDate}
                                    sx={{ mr: 2 }}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Typography sx={{ mr: 2 }}>To</Typography>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    name="endDate"
                                    onChange={onChange}
                                    sx={{ mr: 2 }}
                                    value={filters.endDate}
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
                                <StyledButton sx={{ml:2,mr:1}}onClick={fetchFilteredAnswers}>Search</StyledButton>
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
            <Card sx={{ minHeight:'100vh',backgroundImage: `url(${img3})`, }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={Math.ceil(answers.length / postsPerPage)}
                            page={currentPage}
                            onChange={handlePaginationChange}
                            color="primary"
                            size="large"
                            sx={{ marginBottom: '5px', '& .MuiPaginationItem-root': { color: '#fff' }, '& .Mui-selected': { backgroundColor: '#4CAF50' } }}
                        />
                    </Box>
                    <Posts posts={getPostsForPage(answers, currentPage)} onDelete={handleDelete} />
                </CardContent>
            </Card>
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

  const StyledButton = styled(Button)(() => ({
    transition: 'transform 0.3s, color 0.3s',
    '&:hover': {
      transform: 'scale(1.2)',
  }}));
