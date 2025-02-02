import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import TestComponent from '../components/dashboard/TestComponent';
import PerformanceComponent from '../components/dashboard/PerformanceComponent';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Grid layout for dashboard components */}
        <div className="grid grid-cols-1 gap-6">
          {/* Performance Component */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              {user && <PerformanceComponent userId={user.id} />}
            </div>
          </div>

          {/* Placeholder for Insights Component */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">Insights</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </div>

          {/* Test Section */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Trivia</h2>
              <TestComponent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};