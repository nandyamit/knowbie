// Test related API calls
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ✅ Save test score and return earned badges
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

  return {
    testAttempt: response.data.testAttempt, // The test attempt that was saved
    newBadges: response.data.badges || []   // Any newly assigned badges
  };
};

// Fetch user stats
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
