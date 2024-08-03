import React, { useEffect, useState,useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Posts from './Posts';
import { TextField, IconButton, Box, Tabs, Tab, Button, Typography, Pagination, RadioGroup, FormControlLabel, Radio, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchQuestions, questionsAnswered, questionsUnanswered, sortedByVotes } from '../../services/questionService.js';
import { useMediaQuery, useTheme } from '@mui/material';
import img4 from '../../assets/images/img4.avif'

export default function Questions() {
    const [questions, setQuestions] = useState([]);
    const [filteredQue, setFilteredQue] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState('none'); // State to manage sorting
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const debounceTimeoutRef = useRef(null);

    // Fetch all the questions
    const fetchAllQuestions = async () => {
        let response = await fetchQuestions();
        setQuestions(response);
        setFilteredQue(response);
        setCurrentPage(1); // Reset to first page on new fetch
    };

    // Function to filter all the questions which are answered.
    const answeredQuestions = async () => {
        let response = await questionsAnswered();
        setQuestions(response);
        setFilteredQue(response);
        setCurrentPage(1); // Reset to first page on new filter
    };

    const unansweredQuestions = async () => {
        let response = await questionsUnanswered();
        setQuestions(response);
        setFilteredQue(response);
        setCurrentPage(1); // Reset to first page on new filter
    };

    // Function to sort questions by higher votes
    const sortByVotes = async () => {
        let response = await sortedByVotes();
        setQuestions(response);
        setFilteredQue(response);
        setCurrentPage(1); // Reset to first page on new sort
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        switch (newValue) {
            case 0:
                fetchAllQuestions();
                break;
            case 1:
                answeredQuestions();
                break;
            case 2:
                unansweredQuestions();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        fetchAllQuestions();
    }, []);

    useEffect(() => {
        if (sortBy === 'votes') {
            sortByVotes();
        } else {
            fetchAllQuestions();
        }
    }, [sortBy]);

    // Function to get posts for the current page
    const getPostsForPage = (allPosts, page) => {
        const startIndex = (page - 1) * postsPerPage;
        return allPosts.slice(startIndex, startIndex + postsPerPage);
    };

    // Function to handle pagination change
    const handlePaginationChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            const filteredData = filteredQue.filter((question) => {
                return question.title.toLowerCase().includes(query.toLowerCase());
            });
            setQuestions(filteredData);
        }, 500); //500ms
    };

    return (
        <Box sx={{minHeight:'100vh', backgroundImage: `url(${img4})` }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, color: '#fff' }}>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label={<StyledText sx={{ fontWeight: "bold", fontSize: isSmallScreen ? '0.75rem' : '1rem', color: '#fff' }}>All</StyledText>} />
                    <Tab label={<StyledText sx={{ fontWeight: "bold", fontSize: isSmallScreen ? '0.75rem' : '1rem', color: '#fff' }}>Answered</StyledText>} />
                    <Tab label={<StyledText sx={{ fontWeight: "bold", fontSize: isSmallScreen ? '0.75rem' : '1rem', color: '#fff' }}>Unanswered</StyledText>} />
                    <NavLink to="/addquestion" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{ backgroundColor:'#0F1035', marginTop: 1 , fontSize: isSmallScreen ? '0.75rem' : '1rem'}}>
                            Ask Question
                        </Button>
                    </NavLink>
                </Tabs>
            </Box>
            <Box sx={{ bgcolor: '#fff', borderRadius: 1, p: 2, backgroundColor: 'inherit' }}>
                <Typography variant="h4" sx={{ mb: 2, color: '#fff' }}>
                    Questions: {questions.length}
                </Typography>
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
                    sx={{
                        backgroundColor: '#fff',color:'#000'
                    }}
                />
                {value===0&&
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: '#fff' }}>
                        Sort by:
                    </Typography>
                    <RadioGroup
                        row
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        sx={{color: '#fff' }}
                    >
                    <FormControlLabel
                        value="none"
                        control={<Radio sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }} />}
                        label="None"
                    />
                    <FormControlLabel
                        value="votes"
                        control={<Radio sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }} />}
                        label="Votes"
                    />
                    </RadioGroup>
                </Box>}
                </Box>
                <Box sx={{backgroundImage: 'url(inherit)'}}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2,pt:1 }}>
                    <Pagination
                        count={Math.ceil(questions.length / postsPerPage)}
                        page={currentPage}
                        onChange={handlePaginationChange}
                        size="large"
                        sx={{ marginBottom: '5px', '& .MuiPaginationItem-root': { color: '#fff' }, '& .Mui-selected': { backgroundColor: '#4CAF50' } }} // Custom styles for pagination items
                    />
                </Box>
                <Posts posts={getPostsForPage(questions, currentPage)} />
            </Box>
        </Box>
    );
}

const StyledText = styled(Typography)(() => ({
    transition: 'transform 0.3s, color 0.3s',
    '&:hover': {
        transform: 'translateY(-2px) scale(1.05)',
        color: '#fff'
    },
}));
