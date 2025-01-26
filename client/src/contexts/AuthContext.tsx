import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authApi } from '../api/auth';

type AuthContextType = {
  user: any | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
  
    const value = {
      user,
      loading,
      login: async (username: string, password: string) => {
        try {
          setLoading(true);
          const response = await authApi.login({ username, password });
          localStorage.setItem('token', response.token);
          setUser(response.user);
        } finally {
          setLoading(false);
        }
      },
      logout: () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
      }
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};