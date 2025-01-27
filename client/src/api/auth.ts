import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

interface LoginInput {
 username: string;
 password: string;
}

interface RegisterInput {
 username: string;
 email: string;
 password: string;
}

export const authApi = {
 login: async (data: LoginInput) => {
   const response = await axios.post(`${API_URL}/api/auth/login`, data);
   return response.data;
 },

 register: async (data: RegisterInput) => {
   const response = await axios.post(`${API_URL}/api/auth/register`, data);
   return response.data;
 },

 getCurrentUser: async () => {
   const token = localStorage.getItem('token');
   if (!token) return null;
   
   const response = await axios.get(`${API_URL}/api/auth/me`, {
     headers: { Authorization: `Bearer ${token}` }
   });
   return response.data;
 }
};