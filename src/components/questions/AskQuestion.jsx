import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from '../../context/DataProvider.jsx';
import { addQuestion } from '../../services/questionService.js';
import { Box, Button, Card, CardContent, CardHeader, Container, TextField, Typography,styled } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img4 from '../../assets/images/img3.avif'

const AskQuestion = () => {
    const navigate = useNavigate();
    const { account } = useContext(DataContext);
    
    if(account.isAdmin === true) {
        navigate('/users');
    }

    const [question, setQuestion] = useState({
        question: '',
        title: '',
        tags: ''
    });

    const onInputChange = (e) => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    const onEditorChange = (content) => {
        setQuestion({ ...question, question: content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if the question field is empty
        if (!question.question.trim()) {
            toast.error('Question cannot be empty!');
            return;
        }

        try {
            let response = await addQuestion(question, account);
            if (response.status === 200) {
                toast.success('Question added successfully!');
                setQuestion({
                    question: '',
                    title: '',
                    tags: ''
                });
                setTimeout(() => {
                    navigate('/questions');
                }, 3000);
                
            } else {
                toast.error('Something went wrong! Please try again!');
            }
        } catch (err) {
            console.error('Error while asking the question:', err);
            toast.error('Something went wrong! Please try again!');
        }
    };

    return (
        <>
        <Box sx={{ backgroundImage: `url(${img4})`, height: "100%"}}>
            <Container sx={{ width: "80%",pt:2}}>
                <form onSubmit={handleSubmit} method="post">
                    <Card sx={{ mb: 3, mt: 5 }}>
                        <CardContent>
                            <CardHeader title={<Typography variant="h4"><b>Ask a Question</b></Typography>} />
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                onChange={onInputChange}
                                required
                                id="title"
                                placeholder="Enter Title"
                                helperText="Enter Your title in a few Words"
                                variant="outlined"
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Question</Typography>
                            <ReactQuill
                                value={question.question}
                                onChange={onEditorChange}
                                placeholder="Enter your question here..."
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['bold', 'italic', 'underline'],
                                        ['link', 'image', 'video'],
                                        ['clean']
                                    ],
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <TextField
                                fullWidth
                                label="Question Tags"
                                name="tags"
                                onChange={onInputChange}
                                id="tags"
                                required
                                placeholder="Enter Tags"
                                helperText="Enter Question Tags"
                                variant="outlined"
                            />
                        </CardContent>
                    </Card>

                    <Box display="flex" justifyContent="center" mt={2} pb={2}>
                        <StyledButton type="submit" variant="contained" sx={{backgroundColor:"#7FC7D9",color:'#0F1035'}}>
                            Ask Question
                        </StyledButton>
                    </Box>
                </form>
            </Container>
            <ToastContainer />
        </Box>
        </>
    );
};

export default AskQuestion;

const StyledButton = styled(Button)(() => ({
    transition: 'transform 0.3s, color 0.3s',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: '#7FC7D9'
  }}));
