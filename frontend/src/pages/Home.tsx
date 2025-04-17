import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [apiStatus, setApiStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await axios.get('/api/status');
        setApiStatus(response.data.data.status);
      } catch (error) {
        console.error('Error checking API status', error);
        setApiStatus('API is not responding');
      } finally {
        setLoading(false);
      }
    };

    checkApiStatus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome to the Interview App</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">About This Application</h2>
        <p className="mb-4">
          This is a full-stack application built with Node.js, Express, MongoDB, and React.
          It provides a basic shell with authentication and authorization features.
        </p>
        <p className="mb-4">
          The application is designed to be used for interviewing candidates by intentionally
          introducing broken code for debugging exercises.
        </p>
        
        <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h3 className="font-medium">API Status:</h3>
          {loading ? (
            <div className="animate-pulse">Loading...</div>
          ) : (
            <div className="text-green-600 font-medium">{apiStatus}</div>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Get Started</h2>
          <p className="mb-4">
            Please register or login to access the full features of this application.
          </p>
          <div className="flex space-x-4">
            <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Login
            </a>
            <a href="/register" className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Register
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;