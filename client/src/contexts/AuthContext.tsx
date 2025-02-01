import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi } from '../api/auth';

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    const validateToken = async () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                // Try to get the current user
                const userData = await authApi.getCurrentUser();
                setUser(userData);
            } catch (error) {
                // If token validation fails, remove the token
                console.error('Token validation failed:', error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    // Check token on initial load
    useEffect(() => {
        validateToken();
    }, []);
  
    const value = {
      user,
      loading,
      login: async (username: string, password: string) => {
        try {
          setLoading(true);
          const response = await authApi.login({ username, password });
          
          // Store the token
          localStorage.setItem('token', response.token);
          
          // Set the user
          setUser(response.user);
        } catch (error) {
          // Remove token if login fails
          localStorage.removeItem('token');
          setUser(null);
          throw error;
        } finally {
          setLoading(false);
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        window.location.href = '/';
      }
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};