"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function Profile() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode the token to get user information
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    } else {
      // If no token, redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to the home page or login page
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl">Profile</h2>
      <p>Email: {userEmail}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-[#F67280] text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}