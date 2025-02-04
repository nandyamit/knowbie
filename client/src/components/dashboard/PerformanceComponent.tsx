import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import axios from 'axios';
import BadgeDisplay from '../../components/BadgeDisplay'; 

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

const CATEGORY_COLORS = {
  Film: '#8884d8',
  Music: '#82ca9d',
  Books: '#ffc658'
};

export const PerformanceComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [allAttempts, setAllAttempts] = useState<TestAttempt[]>([]);
  const [displayedAttempts, setDisplayedAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [timeRange, setTimeRange] = useState<'all' | 'year' | 'month' | 'week'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availableCategories, setAvailableCategories] = useState<string[]>(['all']);
  const [badgeCount, setBadgeCount] = useState<number>(0);

  // Fetch badges count
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_URL}/api/badges/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setBadgeCount(response.data.length);
      } catch (error) {
        console.error('Error fetching badges:', error);
        setBadgeCount(0);
      }
    };

    fetchBadges();
  }, [userId]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem('token');
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

        const sortedAttempts = allAttemptsData.sort((a, b) => 
          new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime()
        );

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
        // Group by date with category breakdowns
        const groupedByDate = filteredAttempts.reduce((acc, attempt) => {
          const date = new Date(attempt.dateTaken).toISOString().split('T')[0];
          
          if (!acc[date]) {
            acc[date] = {
              dateTaken: attempt.dateTaken,
              Film: 0,
              Music: 0,
              Books: 0,
              total: 0
            };
          }
          
          // Add correct answers to the specific category
          acc[date][attempt.category] += attempt.correctAnswers;
          // Update total for the day
          acc[date].total += attempt.correctAnswers;
          
          return acc;
        }, {} as Record<string, any>);

        setDisplayedAttempts(Object.values(groupedByDate));
      } else {
        // Keep existing logic for individual categories
        filteredAttempts = filteredAttempts.filter(attempt => attempt.category === selectedCategory);
        setDisplayedAttempts(filteredAttempts.map(attempt => ({
          dateTaken: attempt.dateTaken,
          correctAnswers: attempt.correctAnswers
        })));
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="text-sm font-semibold">{formatDate(label)}</p>
          {payload.map((entry: any) => {
            if (entry.value > 0) {
              return (
                <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
                  {entry.dataKey}: {entry.value} correct answers
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const renderChart = () => {
    if (selectedCategory === 'all') {
      return (
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
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Film" stackId="a" name="Movie" fill={CATEGORY_COLORS.Film} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Music" stackId="a" name="Music" fill={CATEGORY_COLORS.Music} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Books" stackId="a" name="Books" fill={CATEGORY_COLORS.Books} radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }

    return (
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
          fill={CATEGORY_COLORS[selectedCategory as keyof typeof CATEGORY_COLORS] || '#10B981'}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    );
  };

  return (
    <div className="w-full p-4 bg-primary-100 rounded-lg shadow-md">
      <div className="flex justify-end items-center mb-4">
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
          <p className="text-xl font-bold text-blue-600" id="badges-count">
            {badgeCount}
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg">
        <h3 className="text-lg text-center font-semibold mb-3">Your Badges</h3>
        <BadgeDisplay userId={userId} />
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceComponent;