"use client";

import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fugaz_One } from 'next/font/google';
import { AuthContext } from '@/AuthContext'; // Import the AuthContext

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, userEmail, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
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