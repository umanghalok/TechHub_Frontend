import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
import { Box, Typography, Link, Chip, Grid, Paper } from '@mui/material';
import { fetchNoOfVotes } from '../../services/questionService';
import { findNumberOfAns } from '../../services/answerService';
import ContentLoader from 'react-content-loader';

const Shimmer = () => (
    <ContentLoader 
        speed={2}
        width="100%"
        height={160}
        viewBox="0 0 100% 160"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        <rect x="0" y="0" rx="5" ry="5" width="70" height="20" /> 
        <rect x="0" y="30" rx="5" ry="5" width="200" height="20" /> 
        <rect x="0" y="60" rx="5" ry="5" width="100%" height="40" /> 
        <rect x="0" y="110" rx="5" ry="5" width="100%" height="20" /> 
        <rect x="0" y="140" rx="5" ry="5" width="100%" height="20" /> 
    </ContentLoader>
);

export default function Posts({ posts }) {
    const [noOfAns, setNoOfAns] = useState({});
    const [vote, setVotes] = useState({});
    const [loading, setLoading] = useState(true);

    const findFrequencyOfAns = async () => {
        let response = await findNumberOfAns();
        setNoOfAns(response);
    };

    const fetchVotes = async () => {
        let response = await fetchNoOfVotes();
        setVotes(response);
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([findFrequencyOfAns(), fetchVotes()]);
            setTimeout(() => {
                setLoading(false);
            }, 1000); // 1 second delay
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box>
                {[...Array(5)].map((_, index) => (
                    <Paper sx={{ p: 5, mb: 5 }} key={index}>
                        <Shimmer />
                    </Paper>
                ))}
            </Box>
        );
    }

    return (
        <Box>
            {posts.map((question) => (
                <Paper sx={{ p: 5, mb: 5 }} key={question._id}>
                    <Grid container>
                        <Grid item xs={2}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h6">{vote[question._id]}</Typography>
                                <Typography variant="caption">votes</Typography>
                                <Typography variant="h6">
                                    {question._id in noOfAns ? noOfAns[question._id] : 0}
                                </Typography>
                                <Typography variant="caption">Answers</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={10}>
                            <Link
                                component={NavLink}
                                to={`/question/${question._id}`}
                                sx={{ textDecoration: 'none', color: '#0074CC' }}
                            >
                                <Typography variant="h6" sx={{ width: '90%', wordBreak: 'break-all' }}>{question.title}</Typography>
                            </Link>
                            <Typography variant="body2" sx={{ width: '90%', wordBreak: 'break-all' }}>
                                {parse(question.question)}
                            </Typography>
                            <Box mt={2}>
                                {question.tags.split(" ").map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        component={NavLink}
                                        to={`/questionOntags/${tag.toLowerCase()}`}
                                        clickable
                                        sx={{
                                            color: '#fff',
                                            backgroundColor: '#0074CC',
                                            borderRadius: 1,
                                            mr: 1,
                                            mb: 1,
                                            '&:hover': {
                                                backgroundColor: '#365486',
                                                cursor: 'pointer',
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                            <Box display="flex" justifyContent="flex-end">
                                <Typography variant="caption" sx={{ color: '#0074CC' }}>
                                    {question.user.username}
                                </Typography>
                                <Typography variant="caption" sx={{ ml: 1 }}>
                                    asked {question.date.slice(0, 10)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            ))}
        </Box>
    );
}
