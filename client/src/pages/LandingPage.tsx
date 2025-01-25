import React from 'react';
import { Link } from 'react-router-dom';
import { Features } from '../components/marketing/Features';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <header className="w-full bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">Knowbie</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="w-full flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Test Your Knowledge
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Challenge yourself with quizzes, track your progress, and compete with others
              in various knowledge categories.
            </p>
            <div className="mt-8">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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