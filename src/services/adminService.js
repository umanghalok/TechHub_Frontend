import axios from 'axios';

//not https while in local host
const API_URL = 'https://techhub-backend.onrender.com/admin';
//const API_URL = 'http://localhost:8000/admin'

//=========================fetch all users registered===========================
const fetchAllUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, {
        headers: {
            'Authorization': sessionStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        }
    });
    return response.data;
  };

//=========================delete a user===========================
const deleteOneUser = async (id) => {
    const response = await axios.delete(`${API_URL}/deleteUser/${id}`, {
        headers: {
            'Authorization': sessionStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};
  
  
export {fetchAllUsers,deleteOneUser};