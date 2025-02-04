// components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const loadingGif = "/Assets/KnowbieFlapping.gif"; 


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-100 via-secondary-100 to-secondary-200 py-20 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-secondary-300 rounded-lg shadow flex flex-col items-center justify-center">
          <img src={loadingGif} alt="Loading..." className="w-45 h-40" />
          <p className="text-3xl text-medium font-bold text-primary-200">Loading...</p>
        </div>
      </div>
    );
  }
    
  return user ? children : <Navigate to="/login" />;
};