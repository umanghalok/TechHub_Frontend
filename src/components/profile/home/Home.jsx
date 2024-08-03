import { Tabs, Tab, Typography, Avatar, TextField, Button, Box, useMediaQuery, useTheme,styled } from '@mui/material';
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Chart from "../../charts/Chart.jsx";
import { DataContext } from "../../../context/DataProvider.jsx";
import { fetchUserQuestions } from "../../../services/questionService.js";
import { fetchUserAnsweredQuestion } from '../../../services/answerService.js';
import img3 from '../../../assets/images/img3.avif'

export default function Profile() {
    const navigate = useNavigate(); 
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { account } = useContext(DataContext);

    const [filters, setFilters] = useState({ startDate: "", endDate: "" });
    const [questions, setQuestions] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagCounts, setTagCounts] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [answerTags, setAnswerTags] = useState([]);
    const [answerTagCounts, setAnswerTagCounts] = useState([]);
    const [answerCount, setAnswerCount] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        switch (newValue) {
            case 0:
                navigate('/profile');
                break;
            case 1:
                navigate('/myQuestions');
                break;
            case 2:
                navigate('/myAnswers');
                break;
            default:
                break;
        }
    };

    const onChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setFilters({ startDate: "", endDate: "" });
    };

    const fetchQuestions = async () => {
        const response = await fetchUserQuestions(account);
        setQuestions(response);
    };

    const fetchAnswers = async () => {
        const response = await fetchUserAnsweredQuestion(account);
        setAnsweredQuestions(response);
    };

    useEffect(() => {
        fetchQuestions();
        fetchAnswers();
        // eslint-disable-next-line
    }, [filters]);

    useEffect(() => {
        const freqOfTags = {};
        const tagsList = [];
        const counts = [];
        let count = 0;

        questions.forEach(question => {
            const questionDate = question.date.substring(0, 10);
            if (
                (!filters.startDate || questionDate >= filters.startDate) && 
                (!filters.endDate || questionDate <= filters.endDate)
            ) {
                count++;
                question.tags.split(" ").forEach(tag => {
                    if (!freqOfTags[tag]) freqOfTags[tag] = 0;
                    freqOfTags[tag]++;
                });
            }
        });

        setQuestionCount(count);

        for (const tag in freqOfTags) {
            tagsList.push(tag);
            counts.push(freqOfTags[tag]);
        }

        setTags(tagsList);
        setTagCounts(counts);
    }, [questions, filters]);

    useEffect(() => {
        const freqOfTags = {};
        const tagsList = [];
        const counts = [];
        let count = 0;

        answeredQuestions.forEach(answer => {
            const answerDate = answer[0].date.substring(0, 10);
            if (
                (!filters.startDate || answerDate >= filters.startDate) && 
                (!filters.endDate || answerDate <= filters.endDate)
            ) {
                count++;
                answer[0].tags.split(" ").forEach(tag => {
                    if (!freqOfTags[tag]) freqOfTags[tag] = 0;
                    freqOfTags[tag]++;
                });
            }
        });

        setAnswerCount(count);

        for (const tag in freqOfTags) {
            tagsList.push(tag);
            counts.push(freqOfTags[tag]);
        }

        setAnswerTags(tagsList);
        setAnswerTagCounts(counts);
    }, [answeredQuestions, filters]);

    return (
        <Box>
            <Box sx={{ backgroundImage: `url(${img3})` }}>
                <Box sx={{ display: 'flex', justifyContent: 'left', pt: 2, pl: 2 }}>
                    <Avatar sx={{ height: '50px', width: '50px' }} />
                    <Typography sx={{ fontWeight: 'bold', color: '#fff', mt: 2, ml: 2 }}>{`Hi, ${account?.username}`}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 'bold', color: '#fff', mt: 2, ml: 2 }}>{`Email: ${account?.email}`}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', color: '#fff' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab label={<StyledText sx={{ fontWeight: 'bold', color: '#fff' }}>Analysis</StyledText>} />
                        <Tab label={<StyledText sx={{ fontWeight: 'bold', color: '#fff' }}>Questions</StyledText>} />
                        <Tab label={<StyledText sx={{ fontWeight: 'bold', color: '#fff' }}>Answers</StyledText>} />
                    </Tabs>
                </Box>
            </Box>
            <Box sx={{
                pt: 2,
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={onChange}
                        sx={{ mr: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Typography sx={{ mr: 2, display: 'flex', justifyContent: 'center' }}>To</Typography>
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
                <StyledButton onClick={handleReset}>Reset</StyledButton>
            </Box>
            <Box sx={{
                backgroundImage: `url(${img3})`,
                display: 'flex',
                justifyContent: 'center',
                pt: 4,
                color: '#fff',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' }
            }}>
                <Box sx={{ m: 2 }}>
                    <Chart title={`Total Questions asked: ${questionCount}`} count={tagCounts} Tags={tags} />
                </Box>
                <Box sx={{ m: 2 }}>
                    <Chart title={`Total Answers given: ${answerCount}`} count={answerTagCounts} Tags={answerTags} />
                </Box>
            </Box>
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

  
