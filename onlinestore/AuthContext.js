"use client";

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Initialize authentication state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserEmail('');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    try {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to decode token during login:', error);
      setIsAuthenticated(false);
      setUserEmail('');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserEmail('');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userEmail, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}