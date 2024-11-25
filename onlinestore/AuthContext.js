"use client";

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


//A React Context object that allows child components to consume 
//authentication-related data and methods without passing props explicitly.
// Global storage for authentication related states. Refer to react UseContext hook
export const AuthContext = createContext();

//Wraps the app and supplies authentication-related
// state (isAuthenticated, userEmail) and methods (login, logout) to children.
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