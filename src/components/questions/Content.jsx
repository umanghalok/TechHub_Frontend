import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataProvider.jsx';
import { Container, Typography, Box, Button, IconButton, Divider,styled,Paper } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { fetchQuestionById, questionDownvote, questionUpvote, questionVotes } from '../../services/questionService.js';
import { answerFetch, addAnswer, answerDownvote, answerVotes, answerUpvote } from '../../services/answerService.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Content.css';
import ContentLoader from 'react-content-loader';
import img4 from '../../assets/images/img4.avif'

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

export default function Content() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { account } = useContext(DataContext);
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);
    const [votes, setVotes] = useState({});
    const [loginStatus, setLoginStatus] = useState(false);
    const [queVoteDisabled, setQueVoteDisabled] = useState({ up: false, down: false });
    const [answerVoteDisabled, setAnswerVoteDisabled] = useState({});
    const [loadingAnswers, setLoadingAnswers] = useState(true);  // State to track loading

    const AnswerInitialValues = {
        answer: '',
        postedBy: '',
    };
    const [currentAnswer, setCurrentAnswer] = useState(AnswerInitialValues);

    const isLoggedIn = () => {
        return account.email !== "";
    }

    const onInputChange = (content) => {
        setCurrentAnswer({ ...currentAnswer, answer: content });
    };

    const fetchQuestion = async () => {
        let response = await fetchQuestionById(id);
        setQuestion(response);
    };

    const fetchAnswers = async () => {
        setLoadingAnswers(true);
        let response = await answerFetch(id);
        setAnswers(response);
        setTimeout(() => {
            setLoadingAnswers(false);
        }, 1000); // 1 second delay
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await addAnswer(currentAnswer, account, id);
            if (response.status === 200) {
                setAnswers(prevAnswers => [...prevAnswers, currentAnswer]);
                setCurrentAnswer(AnswerInitialValues);
                toast.success('Answer posted successfully!');
                setTimeout(() => {
                    navigate(`/questions`);
                }, 3000);
                
            }
        } catch (err) {
            console.error('Error while answering the question:', err);
            toast.error('Error while posting your answer. Please try again.');
        }
    };

    const upvoteQue = async (e) => {
        if (isLoggedIn()) {
            e.preventDefault();
            try {
                await questionUpvote(id);
                setQueVoteDisabled({ up: true, down: false });
                toast.success('Question upvoted successfully!');
            } catch (err) {
                console.error('Error while upvoting question:', err);
                toast.error('Error while upvoting the question. Please try again.');
            }
        } else {
            navigate("/login");
        }
    }

    const downvoteQue = async (e) => {
        if (isLoggedIn()) {
            e.preventDefault();
            try {
                await questionDownvote(id);
                setQueVoteDisabled({ up: false, down: true });
                toast.success('Question downvoted successfully!');
            } catch (err) {
                console.error('Error while downvoting question:', err);
                toast.error('Error while downvoting the question. Please try again.');
            }
        } else {
            navigate("/login");
        }
    }

    const upvote = async (e, answerId) => {
        if (isLoggedIn()) {
            e.preventDefault();
            try {
                await answerUpvote(answerId);
                setAnswerVoteDisabled(prevState => ({ ...prevState, [answerId]: { up: true, down: false } }));
                toast.success('Answer upvoted successfully!');
            } catch (err) {
                console.error('Error while upvoting answer:', err);
                toast.error('Error while upvoting the answer. Please try again.');
            }
        } else {
            navigate("/login");
        }
    }

    const downvote = async (e, answerId) => {
        if (isLoggedIn()) {
            e.preventDefault();
            try {
                await answerDownvote(answerId);
                setAnswerVoteDisabled(prevState => ({ ...prevState, [answerId]: { up: false, down: true } }));
                toast.success('Answer downvoted successfully!');
            } catch (err) {
                console.error('Error while downvoting answer:', err);
                toast.error('Error while downvoting the answer. Please try again.');
            }
        } else {
            navigate("/login");
        }
    }

    const fetchVotes = async () => {
        const response = await answerVotes();
        setVotes(response);
    }

    const fetchQueVotes = async (id) => {
        await questionVotes(id);
    }

    useEffect(() => {
        if (isLoggedIn()) {
            setLoginStatus(true);
        }
        fetchQuestion();
        fetchAnswers();
        fetchVotes();
        fetchQueVotes(id);
        // eslint-disable-next-line
    }, [id]);

    return (
        <Box sx={{backgroundImage: `url(${img4})`, minHeight: '100vh', paddingTop: '5vh' }}>
            <Container>
                <Box bgcolor="white" p={3} boxShadow={2} borderRadius={4} mb={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h5" ml={1} flexGrow={1}>
                            {question.title}
                        </Typography>
                        <Box>
                            <IconButton onClick={(e) => upvoteQue(e)} disabled={queVoteDisabled.up}>
                                <ThumbUp />
                            </IconButton>
                            <IconButton onClick={(e) => downvoteQue(e)} disabled={queVoteDisabled.down}>
                                <ThumbDown />
                            </IconButton>
                        </Box>
                    </Box>
                    <Divider />
                    <Box sx={{ overflow: 'hidden', maxWidth: '100%' }}>
                        <Typography variant="body1">
                            {question.question && typeof question.question === 'string' ? parse(question.question) : ''}
                        </Typography>
                    </Box>
                </Box>

                <Box mt={4}>
                    <Typography variant="h6" sx={{color:'#fff'}}>
                        {answers.length} Answers
                    </Typography>
                    {loadingAnswers ? (
                        <Box>
                        {[...Array(5)].map((_, index) => (
                            <Paper sx={{ p: 5, mb: 5 }} key={index}>
                                <Shimmer />
                            </Paper>
                        ))}
                    </Box>
                    ) : (
                        answers.map(ans => (
                            <Box key={ans._id} mt={3} bgcolor="white" p={2} boxShadow={2} borderRadius={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="subtitle1" ml={1}>
                                        {votes[ans._id] || 0}
                                    </Typography>
                                    <Box>
                                        <IconButton onClick={(e) => upvote(e, ans._id)} disabled={answerVoteDisabled[ans._id]?.up}>
                                            <ThumbUp />
                                        </IconButton>
                                        <IconButton onClick={(e) => downvote(e, ans._id)} disabled={answerVoteDisabled[ans._id]?.down}>
                                            <ThumbDown />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box sx={{ overflow: 'hidden', maxWidth: '100%' }}>
                                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                        {parse(ans.answer)}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="textSecondary">
                                    Posted By: {ans.postedBy}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>

                {loginStatus && (
                    <Box mt={4}>
                        <Typography variant="h6" sx={{color:'#fff'}}>
                            Your Answer
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <ReactQuill
                                value={currentAnswer.answer}
                                onChange={onInputChange}
                                placeholder="Enter your answer here..."
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['bold', 'italic', 'underline'],
                                        ['link', 'image'],
                                        ['clean']
                                    ],
                                }}
                            />
                        <Box sx={{display: 'flex',justifyContent: 'center'}}>
                        <StyledButton type="submit" variant="contained" sx={{backgroundColor:"#7FC7D9",color:'#0F1035',mt:2}}>
                            Post Your Answer
                        </StyledButton>
                        </Box>
                        </form>
                    </Box>
                )}
            </Container>
            <ToastContainer />
        </Box>
    );
}



const StyledButton = styled(Button)(() => ({
    transition: 'transform 0.3s, color 0.3s',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: '#7FC7D9'
  }}));
