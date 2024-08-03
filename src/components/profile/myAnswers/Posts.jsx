import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import parse from 'html-react-parser';
import { answerVotes } from '../../../services/answerService';
import {Box,Paper,Typography,IconButton,Grid,Link} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
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


export default function Posts({ posts, onDelete }) {
    const [vote, setVotes] = useState({});
    const [loading, setLoading] = useState(true);

    const deleteAnswer = async (id) => {
        await onDelete(id);
    };

    const fetchVotes = async () => {
        try {
            const response = await answerVotes();
            setVotes(response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
    posts.map(answer => (
        <Grid item xs={12} key={answer._id}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h6">{vote[answer._id]}</Typography>
                            <Typography variant="caption">votes</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={10}>
                        <Box display="flex" justifyContent="space-between">
                            <Link
                                component={NavLink}
                                to={`/question/${answer.questionid}`}
                                sx={{ textDecoration: 'none', color: '#0074CC' }}
                            >
                                <Typography variant="body2">View question</Typography>
                            </Link>
                            <Box>
                                <IconButton component={NavLink} to={`/updateanswer/${answer._id}`}>
                                    <Edit sx={{ color: "green" }} />
                                </IconButton>
                                <IconButton onClick={() => deleteAnswer(answer._id)}>
                                    <Delete sx={{ color: "red" }} />
                                </IconButton>
                            </Box>
                        </Box>
                        <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
                            {parse(answer.answer)}
                        </Typography>
                        <Box display="flex" justifyContent="flex-end">
                            <Typography variant="caption" sx={{ color: '#0074CC' }}>
                                {answer.postedBy}
                            </Typography>
                            <Typography variant="caption" sx={{ ml: 1 }}>
                                asked {answer.date.slice(0, 10)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    ))
)
}