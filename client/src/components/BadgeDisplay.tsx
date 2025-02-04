// components/BadgeDisplay.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Badge {
  id: string;
  badgeType: string;
  earnedAt: string;
}

interface BadgeDisplayProps {
  userId: string;
  className?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Badge image mapping using public badge directory
const BADGE_IMAGES = {
  'High Five!': '/badges/high-five-badge.png',
  'Perfect Ten': '/badges/perfect-ten-badge.png',
  'Triple Crown': '/badges/triple-crown-badge.png',
  'Scene Stealer': '/badges/scene-stealer-badge.png',
  'Bookworm Elite': '/badges/bookworm-badge.png',
  'Rhythm Master': '/badges/rhythm-master-badge.png'
};

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ userId, className = '' }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<Badge[]>(
          `${API_URL}/api/badges/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setBadges(response.data);
      } catch (error) {
        console.error('Error fetching badges:', error);
        setError('Failed to load badges');
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [userId]);

  const getBadgeColor = (badgeType: string): string => {
    const colors: Record<string, string> = {
      'High Five!': 'bg-blue-100 text-blue-700 border-blue-200',
      'Perfect Ten': 'bg-purple-100 text-purple-700 border-purple-200',
      'Triple Crown': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Scene Stealer': 'bg-red-100 text-red-700 border-red-200',
      'Bookworm Elite': 'bg-green-100 text-green-700 border-green-200',
      'Rhythm Master': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[badgeType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading badges...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border ${getBadgeColor(badge.badgeType)} flex items-center space-x-3`}
          >
            <div className="w-12 h-12 flex-shrink-0">
              <img
                src={BADGE_IMAGES[badge.badgeType as keyof typeof BADGE_IMAGES]}
                alt={`${badge.badgeType} badge`}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold">{badge.badgeType}</h3>
              <p className="text-sm">
                Earned {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {badges.length === 0 && (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Complete more quizzes to earn badges and showcase your knowledge!
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;