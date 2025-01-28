import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
      console.error('Login error:', err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-secondary-300 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Sign in</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-primary-200 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-primary-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-primary-200 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-primary-200 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-primary-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-secondary-100 hover:bg-secondary-200 text-primary-200 px-4 py-2 rounded"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};