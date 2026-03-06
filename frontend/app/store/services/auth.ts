import { LoginResponse } from '@/app/types';
import { privateApi, publicApi } from './api';

const API_URL = '/auth';
export const authService = {
  async login(data: any): Promise<LoginResponse> {
    const response = await publicApi.post(`${API_URL}/login`, data);
    if (response.data && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token)
    }
    return response.data;
  },

  async register(data: any) {
    const response = await publicApi.post(`${API_URL}/register`, data);
    return response.data;
  },

  async getAuthenticatedUser() {
    const response = await privateApi.get(`${API_URL}/me`);
    return response.data;
  }
};
