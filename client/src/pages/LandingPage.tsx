import React from 'react';
import { Link } from 'react-router-dom';
import { Features } from '../components/marketing/Features';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100 via-secondary-100 to-secondary-200 py-20 flex flex-col items-center justify-center">
      <main className="w-full flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-800 sm:text-7xl lg:text-8xl tracking-tight mb-6 drop-shadow-lg">
              Test Your Knowledge
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-primary-200">
              Challenge yourself with quizzes, track your progress, and compete with others
              in various knowledge categories.
            </p>
            <div className="mt-8">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-primary-200 bg-secondary-300 hover:bg-secondary-200 mb-8 shadow-md p-6"
              >
                Get Started
              </Link>
            </div>
          </div>
          <Features />
        </div>
      </main>
    </div>
  );
};