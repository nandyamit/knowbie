// Test related API calls

// api/test.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const saveTestScore = async (data: {
  userId: string;
  category: string;
  score: number;
  totalQuestions: number;
}) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/api/test/score`,
    data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export const getUserStats = async (userId: string, category: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    `${API_URL}/api/test/stats/${userId}/${category}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};