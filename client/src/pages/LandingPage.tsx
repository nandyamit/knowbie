import React from 'react';
import { Link } from 'react-router-dom';
import { Features } from '../components/marketing/Features';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-primary-100 flex flex-col items-center justify-center">
      <main className="w-full flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-primary-200 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Test Your Knowledge
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-primary-200">
              Challenge yourself with quizzes, track your progress, and compete with others
              in various knowledge categories.
            </p>
            <div className="mt-8">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-200 bg-secondary-100 hover:bg-secondary-200 mb-8"
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