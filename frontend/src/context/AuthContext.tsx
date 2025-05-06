import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { User } from 'shared/types.ts';

// Create a dedicated axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001'
});

// Add a request interceptor to dynamically add the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface AuthContextType {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user on initial load and token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/auth/profile');
        setUser(res.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to load user', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser()
      .catch((error: unknown) => {
        console.error('Error in useEffect', error);
        setLoading(false);
      });
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      setToken(res.data.data.token);
      setUser(res.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await api.post<{ data: { token: string; user: string }}>('/api/auth/register', { email, password });
      localStorage.setItem('token', res.data.data.token);
      setToken(res.data.data.token);
      setUser(res.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Register error', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the api instance so it can be used in other files
export { api };
export default AuthContext;