// src/components/dashboard/EnhancedInsightsComponent.tsx

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface EnhancedInsights {
  aiAnalysis: {
    summary: string;
    categoryInsights: Array<{
      category: string;
      analysis: {
        strengths: string[];
        weaknesses: string[];
        pattern: string;
        trend: string;
      };
      recommendations: Array<{
        focus: string;
        strategy: string;
        resources: Array<{
          type: string;
          title: string;
          link: string;
        }>;
      }>;
    }>;
    learningStrategies: Array<{
      type: string;
      description: string;
      implementation: string;
    }>;
  };
  mlPredictions: {
    predictedScore: number;
    confidence: number;
    recommendedTopics: string[];
  };
  learningPatterns: Array<{
    timeOfDay: string;
    dayOfWeek: string;
    sessionDuration: number;
    averageScore: number;
  }>;
  externalResources: Record<string, Array<{
    title: string;
    platform: string;
    url: string;
    description: string;
  }>>;
}

const EnhancedInsightsComponent: React.FC = () => {
  const [insights, setInsights] = useState<EnhancedInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'predictions' | 'resources'>('overview');
  const { user } = useAuth();

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user?.id) return;

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `${API_URL}/api/enhanced-insights/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setInsights(response.data);
      } catch (error) {
        setError('Failed to fetch enhanced insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user]);

  const renderOverview = () => {
    if (!insights?.aiAnalysis) return null;

    return (
      <div className="space-y-6">
        {/* AI Analysis Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">AI Analysis Summary</h3>
          <p className="text-gray-700">{insights.aiAnalysis.summary}</p>
        </div>

        {/* Category Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.aiAnalysis.categoryInsights.map((insight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">{insight.category}</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{insight.analysis.pattern}</p>
                <div>
                  <p className="font-medium">Strengths:</p>
                  <ul className="list-disc list-inside text-sm">
                    {insight.analysis.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Areas to Improve:</p>
                  <ul className="list-disc list-inside text-sm">
                    {insight.analysis.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLearningPatterns = () => {
    if (!insights?.learningPatterns) return null;

    const timeData = insights.learningPatterns.map(pattern => ({
      timeOfDay: pattern.timeOfDay,
      score: pattern.averageScore,
    }));

    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Your Learning Patterns</h3>
          <div className="h-64">
            <LineChart
              width={600}
              height={200}
              data={timeData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeOfDay" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
            </LineChart>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Best Performance Times:</h4>
            <ul className="list-disc list-inside">
              {insights.learningPatterns.slice(0, 3).map((pattern, index) => (
                <li key={index}>
                  {pattern.timeOfDay} on {pattern.dayOfWeek}: Average score {pattern.averageScore.toFixed(1)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderPredictions = () => {
    if (!insights?.mlPredictions) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-4">Performance Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Predicted Next Score</p>
              <p className="text-2xl font-bold">
                {insights.mlPredictions.predictedScore.toFixed(1)}/10
              </p>
              <p className="text-xs text-gray-500">
                Confidence: {(insights.mlPredictions.confidence * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommended Focus Areas:</h4>
              <ul className="list-disc list-inside">
                {insights.mlPredictions.recommendedTopics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResources = () => {
    if (!insights?.externalResources) return null;

    return (
      <div className="space-y-6">
        {Object.entries(insights.externalResources).map(([category, resources]) => (
          <div key={category} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-4">{category} Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource, index) => (
                <div key={index} className="border p-3 rounded">
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  <p className="text-xs text-gray-500 mt-2">via {resource.platform}</p>
                  <a 
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
                  >
                    Learn More →
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Learning Insights</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b mb-6">
        {(['overview', 'patterns', 'predictions', 'resources'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'patterns' && renderLearningPatterns()}
        {activeTab === 'predictions' && renderPredictions()}
        {activeTab === 'resources' && renderResources()}
      </div>
    </div>
  );
};

export default EnhancedInsightsComponent;