"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Main from "@/components/Main";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication state on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/dashboard'); // Redirect to login page
  };

  // Conditionally render the Login or Dashboard component
  return (
    <Main>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </Main>
  );
}
