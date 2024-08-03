import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { TextField, IconButton, Box, Tabs, Tab, Button, Typography, Pagination, useMediaQuery, useTheme,styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Posts from './Posts';
import { fetchQuestionTags } from '../../services/questionService.js';
import img3 from '../../assets/images/img3.avif'


export default function Tags() {
    const [questions, setQuestions] = useState([]);
    const [filteredQue, setFilteredQue] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const [searchQuery, setSearchQuery] = useState("");
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const {type}=useParams();
    const debounceTimeoutRef = useRef(null);
    //console.log(type);

    // Fetch all the questions
    const fetchTagQuestions = async () => {
        let response = await fetchQuestionTags(type);
        setQuestions(response);
        setFilteredQue(response);
        setCurrentPage(1); // Reset to first page on new fetch
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        switch (newValue) {
            case 0:
                fetchTagQuestions();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        fetchTagQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <Box sx={{ minHeight: '100vh', backgroundImage: `url(${img3})`, }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, color: '#fff' }}>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label={<StyledText sx={{ fontWeight: "bold", fontSize: isSmallScreen ? '0.75rem' : '1rem', color: '#fff' }}>Tag:{type}</StyledText>} />
                    <NavLink to="/questions" style={{ textDecoration: 'none' }}>
                        <Button variant="contained"  sx={{ marginTop: 1 , ml:2,fontSize: isSmallScreen ? '0.75rem' : '1rem',backgroundColor:'#0F1035'}}>
                            Questions
                        </Button>
                    </NavLink>
                </Tabs>
            </Box>
            <Box sx={{ backgroundImage: 'url(inherit)', borderRadius: 1, p: 2 }}>
                <Typography variant="h4" sx={{ mb: 2, color: '#fff' }}>
                    Questions: {questions.length}
                </Typography>
                <Typography variant="h4" sx={{ mb: 2, color: '#fff' }}>
                    Tag: {type}
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
                            backgroundColor: '#fff',
                        }}
                    />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={Math.ceil(questions.length / postsPerPage)}
                        page={currentPage}
                        onChange={handlePaginationChange}
                        color="primary"
                        size="large" // Increase pagination size
                        sx={{ marginBottom:'5px','& .MuiPaginationItem-root': { color: '#fff' }, '& .Mui-selected': { backgroundColor: '#4CAF50' } }} // Custom styles for pagination items
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
