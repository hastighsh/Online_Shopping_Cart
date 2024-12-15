"use client";

import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fugaz_One } from 'next/font/google';
import { AuthContext } from '@/AuthContext'; // Import the AuthProvider to track authentication on local storage.

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);

  const [isAdmin, setIsAdmin] = useState(false); // State to store admin status

  // Fetch user type from API when component mounts
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      const fetchUserType = async () => {
        try {
          const response = await fetch('/api/auth/usertype', {
            method: 'POST', // Change to POST
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }), // Pass the user's email
          });

          const data = await response.json();
          if (data.isAdmin !== undefined) {
            setIsAdmin(data.isAdmin); // Set the admin status
          }
        } catch (error) {
          console.error('Error fetching user type:', error);
        }
      };
      fetchUserType();
    }
  }, [isAuthenticated, userEmail]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
     {isAdmin && isAuthenticated ? (
        // Admin panel appears for authenticated admin users
       <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>
          <Link href="/admin">REA Admin Panel</Link>
      </h1> 
      ) : isAuthenticated ? (
       <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>
        Enjoy shopping at REA
      </h1>     // Doesn't need to lead anywhere for non-admin authenticated users
      ) : (
  <h1 className={'text-base sm:text-lg textGradient ' + fugaz.className}>
    <Link href="/">REA</Link>
  </h1>
)}

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-4">
          <Link href="/catalog">Catalog</Link>
        </nav>
        <Link href="/cart" className="text-[#F67280] hover:underline">
          Cart
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link href="/profile" className="text-[#F67280] hover:underline">
              {userEmail}
            </Link>
            <button
              onClick={handleLogout}
              className="text-[#F67280] hover:underline"
            >
              Logout
            </button>
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
