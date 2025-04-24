import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { api } from '../context/AuthContext.tsx'; // Adjust the import based on your project structure

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [protectedData, setProtectedData] = useState<string>('');
  const [adminData, setAdminData] = useState<string>('');
  const [protectedError, setProtectedError] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const protectedResponse = await api.get< { message: string }>('/api/protected');
      setProtectedData(protectedResponse.data.message);
    } catch (error) {
      console.error('Error fetching protected data', error);
      setProtectedError('Failed to fetch protected data');
    }

    // Only try to access admin route if user is admin
    if (user.role === 'admin') {
      try {
        const adminResponse = await api.get< { message: string }>('/api/admin');
        setAdminData(adminResponse.data.message);
      } catch (error) {
        console.error('Error fetching admin data', error);
        setAdminError('Failed to fetch admin data');
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData().catch((error: unknown) => {
      console.error('Error in useEffect', error);
      setProtectedError('Failed to fetch data');
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Joined</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Protected Data</h2>
        {protectedError ? (
          <div className="text-red-600">{protectedError}</div>
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p>{protectedData}</p>
          </div>
        )}
      </div>

      {user.role === 'admin' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Admin Data</h2>
          {adminError ? (
            <div className="text-red-600">{adminError}</div>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p>{adminData}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;