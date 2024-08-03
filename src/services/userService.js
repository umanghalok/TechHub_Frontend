import axios from 'axios';

//not https while in local host
const API_URL = 'https://techhub-backend.onrender.com';
//const API_URL = 'http://localhost:8000'


const userSignup = async (signup) => {
    return await axios.post(`${API_URL}/signup`,signup);
  };
  
const userLogin = async (login) => {
    return await axios.post(`${API_URL}/login`,login);
};
  
export {userSignup, userLogin};