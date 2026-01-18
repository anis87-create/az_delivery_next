
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth/';
export const authService = {

  async login(data:any) {
    const response = await axios.post(API_URL+'login', data);
    if(response.data && typeof window !== 'undefined'){
      localStorage.setItem('token', response.data.token)
    }
    return response.data;
  },

  async register(data:any) {
    const response = await axios.post(API_URL+'register', data);

    return response.data;
  },

  async getAuthenticatedUser() {
   const token = typeof window !== 'undefined' ?  localStorage.getItem('token') : null;
   const response = await axios.get(API_URL + 'me', {
     headers: {
       Authorization: `Bearer ${token}`
     }
   });
   return response.data;
  }
};