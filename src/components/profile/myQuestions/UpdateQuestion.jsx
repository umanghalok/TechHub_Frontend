import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateQuestion, fetchQuestionById } from '../../../services/questionService.js'; 
import { Box, Button, Card, CardContent, CardHeader, Container, TextField, Typography, styled } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img4 from '../../../assets/images/img4.avif'


const UpdateQuestion = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState('');
    const [question, setQuestion] = useState({ title: '', content: '', tags: '' });

    const fetchQuestion = async () => {
        try {
            const response = await fetchQuestionById(id);
            setQuestion({title:response.title,tags:response.tags,content:response.question});
            //console.log(question);
        } catch (err) {
            console.error('Error fetching question:', err);
            toast.error('Error fetching question.');
        }
    };

    useEffect(() => {   
        fetchQuestion();
        // eslint-disable-next-line
    }, []);

    const onInputChange = (e) => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    const onEditorChange = (content) => {
        setQuestion({ ...content, content: content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { title: question.title, question: question.question, tags: question.tags };
            const response = await updateQuestion(id, data);
            if (response.status === 200) {
                setError('');
                toast.success('Question updated successfully!');
                setTimeout(() => {
                    navigate('/questions'); // Redirect after successful update
                }, 3000);
            } else {
                setError('Something went wrong! Please try again!');
                toast.error('Error updating question. Please try again!');
            }
        } catch (err) {
            console.error('Error updating the question:', err);
            setError('Something went wrong! Please try again!');
            toast.error('Error updating question. Please try again!');
        }
    };

    return (
        <Box sx={{ 
            backgroundImage: `url(${img4})` , 
            height: "100%",
            backgroundSize: 'cover'
        }}>
            <Container sx={{ width: "80%", pt: 2 }}>
                <form onSubmit={handleSubmit} method="post">
                    <Card sx={{ mb: 3, mt: 5 }}>
                        <CardContent>
                            <CardHeader title={<Typography variant="h4"><b>Update a Public Question</b></Typography>} />
                            <TextField
                                fullWidth
                                
                                name="title"
                                onChange={onInputChange}
                                required
                                id="title"
                                placeholder="Enter Title"
                                helperText="Enter Your title in a few Words"
                                variant="outlined"
                                value={question.title}
                            />
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Question</Typography>
                            <ReactQuill
                                value={question.content}
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
                                
                                name="tags"
                                onChange={onInputChange}
                                id="tags"
                                required
                                placeholder="Enter Tags"
                                helperText="Enter Question Tags"
                                variant="outlined"
                                value={question.tags}
                            />
                        </CardContent>
                    </Card>

                    {error && (
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box display="flex" justifyContent="center" mt={2} pb={2}>
                        <StyledButton type="submit" variant="contained">
                            Update Question
                        </StyledButton>
                    </Box>
                </form>
            </Container>
            <ToastContainer />
        </Box>
    );
};

export default UpdateQuestion;

const StyledButton = styled(Button)(() => ({
    backgroundColor: "#7FC7D9",
    color: '#0F1035',
    transition: 'transform 0.3s, color 0.3s',
    '&:hover': {
        transform: 'scale(1.1)',
        backgroundColor: '#7FC7D9'
    }
}));
