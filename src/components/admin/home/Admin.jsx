import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import {Avatar, Box, Button, Tab, Tabs, TextField, Typography,useMediaQuery, useTheme,styled} from '@mui/material';
import Chart from "../../charts/Chart.jsx";
import { DataContext } from "../../../context/DataProvider.jsx";
import { fetchQuestions, fetchMonths } from "../../../services/questionService.js";
import img3 from '../../../assets/images/img3.avif'

export default function Admin() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { account } = useContext(DataContext);
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });
  const [questions, setQuestions] = useState([]);
  const [Tags, setTags] = useState([]);
  const [count, setCount] = useState([]);
  const [queLen, setQueLen] = useState(0);
  
  const [monthCounts, setMonthCounts] = useState({
    january: 0, february: 0, march: 0, april: 0, may: 0, june: 0,
    july: 0, august: 0, september: 0, october: 0, november: 0, december: 0
  });

  useEffect(() => {
    fetchAllQuestions();
    fetchMonthQuestions();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateTagCounts();
    // eslint-disable-next-line
  }, [questions, filters]);

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

  const onChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ startDate: "", endDate: "" });
  };

  const fetchAllQuestions = async () => {
    const response = await fetchQuestions(account);
    setQuestions(response);
  };

  const fetchMonthQuestions = async () => {
    const response = await fetchMonths();
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthCountsCopy = { ...monthCounts };

    response.forEach(item => {
      const monthIndex = item._id - 1;
      const count = item.count;
      monthCountsCopy[monthNames[monthIndex]] = count;
    });

    setMonthCounts(monthCountsCopy);
  };

  const updateTagCounts = () => {
    const freqOfTags = {};
    let filteredQuestions = questions;

    if (filters.startDate && filters.endDate) {
      filteredQuestions = questions.filter(
        question => question.date.substring(0, 10) >= filters.startDate &&
          question.date.substring(0, 10) <= filters.endDate
      );
    }

    filteredQuestions.forEach(question => {
      question.tags.split(" ").forEach(tag => {
        freqOfTags[tag] = (freqOfTags[tag] || 0) + 1;
      });
    });

    setTags(Object.keys(freqOfTags));
    setCount(Object.values(freqOfTags));
    setQueLen(filteredQuestions.length);
  };

  return (
    <Box>
      <Box
        sx={{ backgroundImage: `url(${img3})` }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'left', pt: 2, pl: 2 }}>
          <Avatar sx={{ height: '50px', width: '50px' }} />
          <Typography sx={{ fontWeight: 'bold', color: '#fff', mt: 2, ml: 2 }}>
            {`Hi, ${account.username}`}
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 'bold', color: '#fff', mt: 2, ml: 2 }}>
          {`Email: ${account.email}`}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', color: '#fff' }}>
          <Tabs value={value} onChange={handleChange} centered>
            {['Analysis', 'All Users', 'All Questions', 'All Answers'].map((label, index) => (
              <Tab
                key={index}
                label={
                  <StyledText
                    sx={{
                      fontWeight: "bold",
                      fontSize: isSmallScreen ? '0.75rem' : '1rem',
                      color: '#fff'
                    }}
                  >
                    {label}
                  </StyledText>
                }
              />
            ))}
          </Tabs>
        </Box>
      </Box>
      <Box sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            value={filters.endDate}
            sx={{ mr: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <StyledButton onClick={handleReset}>Reset</StyledButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            pt: 4,
            color: '#fff',
            backgroundImage: `url(${img3})`,
            flexDirection: { xs: 'column', sm: 'column', md: 'row' }
          }}
        >
          <Box sx={{ m: 2 }}>
            <Chart title={`Total Questions asked: ${queLen}`} count={count} Tags={Tags} />
          </Box>
          <Box sx={{ m: 2 }}>
            <Chart
              title="Monthwise Questions"
              count={Object.values(monthCounts)}
              Tags={Object.keys(monthCounts)}
            />
          </Box>
        </Box>
      </Box>
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