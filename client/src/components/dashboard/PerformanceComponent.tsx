import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

interface TestAttempt {
  id: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  dateTaken: string;
}

interface Stats {
  totalAttempts: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const PerformanceComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [allAttempts, setAllAttempts] = useState<TestAttempt[]>([]);
  const [displayedAttempts, setDisplayedAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [timeRange, setTimeRange] = useState<'all' | 'year' | 'month' | 'week'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availableCategories, setAvailableCategories] = useState<string[]>(['all']);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch attempts for all categories
        const categories = ['Film', 'Music', 'Books'];
        const allAttemptsData: TestAttempt[] = [];

        for (const category of categories) {
          const response = await axios.get(
            `${API_URL}/api/test/attempts/${userId}/${category}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          allAttemptsData.push(...response.data);
        }

        // Sort by date
        const sortedAttempts = allAttemptsData.sort((a, b) => 
          new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime()
        );

        // Determine available categories
        const uniqueCategories = [...new Set(sortedAttempts.map(attempt => attempt.category))];
        setAvailableCategories(['all', ...uniqueCategories]);
        
        setAllAttempts(sortedAttempts);
        setStats({ totalAttempts: sortedAttempts.length });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch performance data');
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [userId]);

  useEffect(() => {
    const filterAndProcessAttempts = () => {
      let filteredAttempts = filterAttemptsByTimeRange(allAttempts);

      if (selectedCategory === 'all') {
        // Group by date and show total correct answers for each day
        const groupedByDate = filteredAttempts.reduce((acc, attempt) => {
          const date = new Date(attempt.dateTaken).toISOString().split('T')[0];
          const attemptsByDate = filteredAttempts.filter(a => 
            new Date(a.dateTaken).toISOString().split('T')[0] === date
          );
          
          if (!acc[date]) {
            acc[date] = {
              dateTaken: attempt.dateTaken,
              correctAnswers: attemptsByDate.reduce((sum, a) => sum + a.correctAnswers, 0)
            };
          }
          return acc;
        }, {} as Record<string, { dateTaken: string; correctAnswers: number }>);

        setDisplayedAttempts(Object.values(groupedByDate));
      } else {
        // Filter for specific category
        filteredAttempts = filteredAttempts.filter(attempt => attempt.category === selectedCategory);
        setDisplayedAttempts(filteredAttempts);
      }
    };

    filterAndProcessAttempts();
  }, [selectedCategory, timeRange, allAttempts]);

  const filterAttemptsByTimeRange = (data: TestAttempt[]) => {
    const now = new Date();
    return data.filter(attempt => {
      const attemptDate = new Date(attempt.dateTaken);
      switch (timeRange) {
        case 'week':
          return (now.getTime() - attemptDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return (now.getTime() - attemptDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        case 'year':
          return (now.getTime() - attemptDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Performance</h2>
        <div className="flex gap-4">
          <select 
            className="p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category === 'Film' ? 'Movie' : 
                 category === 'all' ? 'All Trivia' : 
                 category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <select 
            className="p-2 border rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="all">All Time</option>
            <option value="year">Past Year</option>
            <option value="month">Past Month</option>
            <option value="week">Past Week</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Attempts</p>
          <p className="text-xl font-bold text-blue-600">{stats?.totalAttempts || 0}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Badges Earned</p>
          <p className="text-xl font-bold text-blue-600">Coming soon...</p>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Your Badges</h3>
        <div className="text-gray-600">
          Complete more tests to earn badges and showcase your knowledge!
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart
            data={displayedAttempts}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dateTaken" 
              tickFormatter={formatDate}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={formatDate}
              formatter={(value: number) => [
                `${value}`, 
                'Correct Answers'
              ]}
            />
            <Bar
              dataKey="correctAnswers"
              name="Correct Answers"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceComponent;