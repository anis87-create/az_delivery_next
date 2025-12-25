
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/';
export const authService = {

  async login(data) {
    const response = await axios.post(API_URL+'auth/login', data);
    if(response.data && typeof window !== 'undefined'){
      localStorage.setItem('token', JSON.stringify(response.data.token))
    }
    return response.data;
  },

  async register(data) {
    const response = await axios.post(API_URL+'auth/register', data);

    return response.data;
  },

  async getAuthenticatedUser() {
   const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
   const response = await axios.get(API_URL + 'auth/me', {
     headers: {
       Authorization: `Bearer ${token}`
     }
   });
   return response.data;
  }
};