import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true  // Important for handling cookies/sessions if needed
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

interface LoginInput {
 username: string;
 password: string;
}

interface RegisterInput {
 username: string;
 email: string;
 password: string;
 confirmPassword?: string;  // Optional, as it's not sent to backend
}

export const authApi = {
  login: async (credentials: LoginInput) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: RegisterInput) => {
    // Destructure to remove confirmPassword before sending to backend
    const { confirmPassword, ...registerData } = data;
    const response = await api.post('/api/auth/register', registerData);
    return response.data;
  },
  
  validateToken: async (token: string) => {
    const response = await api.get('/api/auth/validate-token');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  }
};