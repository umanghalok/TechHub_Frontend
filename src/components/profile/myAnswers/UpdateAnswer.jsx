import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import { updateAnswer, fetchAnswerById } from '../../../services/answerService.js'; // Assume this service function exists
import {Button,Card,CardHeader,Container,Typography,Box,styled} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import img4 from '../../../assets/images/img4.avif'

export default function UpdateAnswer() {
  const { id } = useParams();
  const editor = useRef(null);
  const [answer, setAnswer] = useState({});
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const fetchAnswer = async (id) => {
    try {
      let response = await fetchAnswerById(id);
      setAnswer(response);
      setValue(response.answer);
    } catch (error) {
      toast.error('Failed to fetch answer. Please try again later.');
      console.error('Error fetching answer:', error);
    }
  };

  const updateAns = async (e, id) => {
    e.preventDefault();
    try {
      const data = { answer: value };
      let response = await updateAnswer(id, data);
      if (response.status === 200) {
        toast.success('Your answer has been updated successfully!');
        setTimeout(() => {
          navigate('/myAnswers');
        }, 3000);
        
      } else {
        toast.error('Failed to update answer. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while updating your answer.');
      console.error('Error updating answer:', error);
    }
  };

  useEffect(() => {
    fetchAnswer(id);
  }, [id]);

  return (
    <Box sx={{ backgroundImage: `url(${img4})`, height: "100vh" }}>
      <Container sx={{ pt:4,width: "70%", display: "block", margin: "auto" }}>
        <Card sx={{ backgroundColor: "#7FC7D9" }}>
          <CardHeader title={<Typography variant="h3"><b>Update Your Answer</b></Typography>} />
        </Card>

        <form method="post" className="mt-3" onSubmit={(e) => updateAns(e, answer._id)}>
          <ReactQuill
            ref={editor}
            value={value}
            onChange={setValue}
            placeholder="Enter your answer here..."
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
          <Box sx={{display: 'flex',justifyContent: 'center'}}>
          <StyledButton type="submit" variant="contained" sx={{ backgroundColor:'#7FC7D9', color:'#000',mt: 5, mb: 5 }}>
            Submit
          </StyledButton>
          </Box>
        </form>
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
