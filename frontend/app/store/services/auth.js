
import axios from 'axios';
const API_URL = 'http://localhost:5000/api/auth/register';
export const authService = {

  async login(data) {
    return axios.post();
  },

  async register(data) {
    return axios.post(API_URL, data);
  }
};