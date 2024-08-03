import axios from 'axios';

//not https while in local host
const API_URL = 'https://techhub-backend.onrender.com/question';
//const API_URL = 'http://localhost:8000/question'


//===================================post a question======================================
const addQuestion = async (question,user) => {
    const data = { user, ...question };
    return await axios.post(`${API_URL}/addquestion`,data,{
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

//===================================fetch all questions======================================
const fetchQuestions = async () => {
    const response = await axios.get(`${API_URL}/fetchQuestions`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch a single question======================================
const fetchQuestionById = async (id) => {
    const response = await axios.get(`${API_URL}/fetchQuestionsById/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch questions of a user======================================
const fetchUserQuestions = async (user) => {
    const response = await axios.get(`${API_URL}/fetchUserQuestions`, {
        params: user,//cant send it as a body due to get request(only possible in post request)
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch user filtered profile questions of a user======================================
const fetchUserFilteredQuestions = async (data,user) => {
    const response = await axios.get(`${API_URL}/fetchUserFilteredQuestions`, {
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

//===================================fetch user filtered profile questions of every user======================================
const fetchAllFilteredQuestions = async (data) => {
    const response = await axios.get(`${API_URL}/fetchFilteredQuestions`, {
        params: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch all the answered questions======================================
const questionsAnswered = async () => {
    const response = await axios.get(`${API_URL}/answeredQuestions`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};
//===================================fetch all the unanswered questions======================================
const questionsUnanswered = async () => {
    const response = await axios.get(`${API_URL}/unansweredQuestions`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================sort questions by number of votes======================================
const sortedByVotes = async () => {
    const response = await axios.get(`${API_URL}/fetchQuestionsByHigherVotes`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================fetch all votes======================================
const fetchNoOfVotes = async () => {
    const response = await axios.get(`${API_URL}/fetchallVotes`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

//===================================downvote a question======================================
const questionDownvote = async (id) => {
    const response = await axios.put(`${API_URL}/downvote/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================upvote a question======================================
const questionUpvote = async (id) => {
    const response = await axios.put(`${API_URL}/upvote/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}
//===================================fetch votes of a question======================================
const questionVotes = async (id) => {
    const response = await axios.get(`${API_URL}/fetchVotes/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================delete a question======================================
const deleteQue = async (id) => {
    const response = await axios.delete(`${API_URL}/deletequestion/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================fetch the tags used by a user======================================
const usedUserTags = async (user) => {
    const response = await axios.get(`${API_URL}/usedtags/${user.username}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================fetch all tags======================================
const usedAllTags = async () => {
    const response = await axios.get(`${API_URL}/usedtags`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================fetch questions by months======================================
const fetchMonths = async () => {
    const response = await axios.get(`${API_URL}/questionByMonth`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

//===================================update a question======================================
const updateQuestion = async (id,data) => {
    const response = await axios.put(`${API_URL}/updatequestion/${id}`, data,{
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response;
}

//===================================fetch questions of a particular tag======================================
const fetchQuestionTags = async (type) => {
    const response = await axios.get(`${API_URL}/questionOntags/${type}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.data;
}

export {addQuestion,fetchQuestions,questionsAnswered,questionsUnanswered, sortedByVotes, fetchNoOfVotes, questionDownvote, questionUpvote, questionVotes, fetchUserQuestions,fetchUserFilteredQuestions, deleteQue,usedUserTags,usedAllTags,fetchAllFilteredQuestions,fetchMonths,fetchQuestionById,updateQuestion,fetchQuestionTags};