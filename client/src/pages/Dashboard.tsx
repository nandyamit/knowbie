import React from "react";
import { useAuth } from "../contexts/AuthContext";
import TestComponent from "../components/dashboard/TestComponent";
import PerformanceComponent from "../components/dashboard/PerformanceComponent";
import FirstTimeUserMessage from "../components/dashboard/FirstTimeUserMessage";

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100 via-secondary-100 to-secondary-200 py-20 flex flex-col items-center justify-center">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* First-Time User Message */}
        {user && <FirstTimeUserMessage userId={(user.id)} />}

        {/* Grid layout for dashboard components */}
        <div className="grid grid-cols-1 gap-6">
          {/* Test Section */}
          <div className="bg-secondary-300 overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h2 className="text-3xl text-center font-bold text-primary-200 mb-4">Choose a Trivia</h2>
              <TestComponent />
            </div>
          </div>

          {/* Performance Component */}
          <div className="bg-secondary-300 overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h2 className="text-3xl text-center font-bold text-primary-200 mb-4">Your Performance</h2>
              {user && <PerformanceComponent userId={user.id} />}
            </div>
          </div>


        </div>
      </main>
    </div>
  );
};
