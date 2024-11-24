"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fugaz_One } from 'next/font/google';
import { jwtDecode } from 'jwt-decode';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Decode the token to get user information
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // Redirect to the home page or login page
    router.push('/');
  };

  return (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>
        <Link href="/">REA</Link>
      </h1>
      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-4">
          <Link href="/catalog">Catalog</Link>
          {/* Add more links as needed */}
        </nav>
        <Link href="/cart" className="text-[#F67280] hover:underline">
          Cart
        </Link>
        {isAuthenticated ? (
          <div className="relative">
            {/* Profile button */}
            <Link href="/profile" className="text-[#F67280] hover:underline">
              Profile
            </Link>
          </div>
        ) : (
          <Link href="/login" className="text-[#F67280] hover:underline">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}