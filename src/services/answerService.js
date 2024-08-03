import axios from 'axios';

//not https while in local host
const API_URL = 'https://techhub-backend.onrender.com/answer';
//const API_URL = 'http://localhost:8000/answer'


//===================================fetch number of answers======================================
const findNumberOfAns = async () => {
    const response = await axios.get(`${API_URL}/findNumberOfAnswer`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch answer of a question======================================
const answerFetch = async (id) => {
    const response = await axios.get(`${API_URL}/fetchanswer/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================add an answer======================================
const addAnswer = async (currAnswer,user,id) => {
    const data = { user, ...currAnswer };
    return await axios.post(`${API_URL}/addanswer/${id}`,data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

//===================================downvote an answer======================================
const answerDownvote = async (id) => {
    const response = await axios.put(`${API_URL}/downvote/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================upvote an answer======================================
const answerUpvote = async (id) => {
    const response = await axios.put(`${API_URL}/upvote/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================fetch number of votes======================================
const answerVotes = async () => {
    const response = await axios.get(`${API_URL}/fetchVotes`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================fetch questions that have been answered by a user======================================
const fetchUserAnsweredQuestion = async (user) => {
    const response = await axios.get(`${API_URL}/fetchUserAnsweredQuestions`, {
        params: user,//cant send it as a body due to get request(only possible in post request)
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};


//===================================fetch a user's answers on basis of filter======================================
const fetchUserFilteredAnswers = async (data,user) => {
    const response = await axios.get(`${API_URL}/fetchUserFilteredAnswers`, {
        params: {
            ...user,
            ...data // Merge user and data objects into query parameters
        },//cant send it as a body due to get request(only possible in post request)
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch all answers on basis of filter======================================
const fetchAllFilteredAnswers = async (data) => {
    const response = await axios.get(`${API_URL}/fetchAllFilteredAnswers`, {
        params: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch the answer of one user======================================
const fetchOneUserAnswers = async (user) => {
    const response = await axios.get(`${API_URL}/fetchUserAnswers/${user.username}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch all answers of a user======================================
const fetchAllAnswers = async () => {
    const response = await axios.get(`${API_URL}/fetchanswer`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch tags answered by a user======================================
const givenAnswersTags = async (user) => {
    const response = await axios.get(`${API_URL}/givenAnswersTags/${user.username}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================fetch all tags of answers======================================
const givenAllAnswersTags = async () => {
    const response = await axios.get(`${API_URL}/givenAllAnswersTags`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================delete an answer======================================
const deleteAns = async (id) => {
    const response = await axios.delete(`${API_URL}/deleteanswer/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================fetch an answer by id(while updating)======================================
const fetchAnswerById = async (id) => {
    const response = await axios.get(`${API_URL}/fetchAnswerById/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================update an answer======================================
const updateAnswer = async (id,data) => {
    const response = await axios.put(`${API_URL}/updateanswer/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response;
}

export {findNumberOfAns,answerFetch,addAnswer, answerDownvote, answerUpvote, answerVotes, fetchUserAnsweredQuestion, fetchUserFilteredAnswers, fetchOneUserAnswers, givenAnswersTags, deleteAns, fetchAllAnswers,fetchAllFilteredAnswers,givenAllAnswersTags,fetchAnswerById,updateAnswer};