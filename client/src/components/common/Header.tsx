// components/common/Header.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Header = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
  
    return (
      <header className="bg-secondary-300 shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <img 
              src="Assets/knowbie_logo.png" 
              alt="Knowbie" 
              className="h-16 w-auto cursor-pointer" 
              onClick={() => navigate('/')}/>
            </div>
  
            <div className="flex items-center">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
                  >
                    <span>{user.username}</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="bg-secondary-100 text-primary-200 px-4 py-2 rounded-md hover:bg-secondary-200 ">Sign in</Link>
                  <Link to="/signup" className="bg-secondary-100 text-primary-200 px-4 py-2 rounded-md hover:bg-secondary-200">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    );
  };