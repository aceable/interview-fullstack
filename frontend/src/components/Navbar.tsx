import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">Interview App</Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200">Home</Link>
            
            {isAuthenticated && user ? (
              <>
                <Link to="/profile" className="hover:text-blue-200">Profile</Link>
                <button 
                  onClick={logout} 
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Logout
                </button>
                <span className="ml-4">Welcome, {user.email}</span>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;