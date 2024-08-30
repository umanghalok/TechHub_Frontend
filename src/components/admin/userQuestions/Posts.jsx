import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
import {  fetchNoOfVotes } from '../../../services/questionService';
import { findNumberOfAns } from '../../../services/answerService';
import {Box,Paper,Typography,IconButton,Chip,Grid,Link} from '@mui/material';
import {  Delete } from '@mui/icons-material';
import ContentLoader from 'react-content-loader';

const Shimmer = (props) => (
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


export default function Posts({ posts, onDelete }) {
    const [loading, setLoading] = useState(true);
    const [noOfAns, setNoOfAns] = useState({});
    const [vote, setVotes] = useState({});

    const deleteQuestion = async (id) => {
        await onDelete(id);
    };

    const findFrequencyOfAns = async () => {
        const response = await findNumberOfAns();
        setNoOfAns(response);
    };

    const fetchVotes = async () => {
        const response = await fetchNoOfVotes();
        setVotes(response);
    };

    useEffect(() => {
        findFrequencyOfAns();
        fetchVotes();
        setTimeout(() => {
            setLoading(false);
        }, 1000); // 1 second delay
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
            {posts.map(question => (
                <Grid item xs={12} key={question._id}>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography variant="h6">{vote[question._id]}</Typography>
                                    <Typography variant="caption">votes</Typography>
                                    <Typography variant="h6" mt={2}>
                                        {question._id in noOfAns ? noOfAns[question._id] : 0}
                                    </Typography>
                                    <Typography variant="caption">Answers</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={10}>
                                <Box display="flex" justifyContent="space-between">
                                    <Link
                                        component={NavLink}
                                        to={`/question/${question._id}`}
                                        sx={{ textDecoration: 'none', color: '#0074CC' }}
                                    >
                                        <Typography variant="h6">{question.title}</Typography>
                                    </Link>
                                    <Box>
                                        <IconButton onClick={() => deleteQuestion(question._id)}>
                                            <Delete sx={{ color: "red" }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                    {parse(question.question)}
                                </Typography>
                                <Box mt={2}>
                                    {question.tags.split(" ").map(tag => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            component={NavLink}
                                            to={`/questionOntags/${tag.toLowerCase()}`}
                                            clickable
                                            sx={{ color: '#fff', backgroundColor: '#0074CC', borderRadius: 1, mr: 1, mb: 1, '&:hover': { backgroundColor: '#365486', cursor: 'pointer', transform: 'scale(1.05)' } }}
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
                </Grid>
            ))}
        </Box>
    );
}